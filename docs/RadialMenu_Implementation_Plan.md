# 实施计划：弹出菜单从数据库提取provider并支持滚动显示

## 1. 需求分析
根据用户需求，需要实现以下功能：
- 弹出菜单选项从数据库中提取所有provider名称
- 显示6-8个provider
- 支持通过鼠标悬浮上下端来滚动显示更多provider

## 2. 现状分析
- 当前弹出菜单使用静态的`PROVIDERS`数组（在`constants/providers.ts`中定义）
- 数据库中API Key表有`platform`字段存储提供商信息
- 项目已有虚拟滚动组件`VirtualList`可用于实现滚动功能
- 弹出菜单在`FloatingToolbar.tsx`中通过点击"更多"按钮触发

## 3. 实施步骤

### 3.1 后端实现
1. **创建新的Tauri命令**：
   - 在`src-tauri/src/commands/api_key_commands.rs`中添加`get_all_platforms`命令
   - 实现数据库查询逻辑，从所有API Key中提取唯一的platform值

2. **数据库操作**：
   - 在`src-tauri/src/database/api_key.rs`中添加`get_all_platforms`函数
   - 使用SQL查询获取所有唯一的platform值：`SELECT DISTINCT platform FROM api_keys WHERE platform IS NOT NULL`

### 3.2 前端实现
1. **修改服务层**：
   - 在`src/services/apiKeyService.ts`中添加`getAllPlatforms`方法
   - 调用新的Tauri命令获取所有platform列表

2. **修改弹出菜单组件**：
   - 修改`FloatingToolbar.tsx`中的径向菜单实现
   - 替换静态的`PROVIDERS`数组为从数据库获取的动态数据
   - 实现虚拟滚动功能来显示大量provider

3. **实现滚动功能**：
   - 使用现有的`VirtualList`组件实现provider列表的虚拟滚动
   - 添加鼠标悬浮检测逻辑，当鼠标悬浮在菜单上下端时自动滚动

### 3.3 UI/UX优化
1. **限制显示数量**：
   - 默认只显示6-8个provider
   - 通过虚拟滚动技术优化性能

2. **滚动交互**：
   - 实现鼠标悬浮在菜单顶部时向上滚动
   - 实现鼠标悬浮在菜单底部时向下滚动
   - 添加平滑滚动动画

## 4. 详细实现方案

### 4.1 后端代码修改

1. 在`src-tauri/src/database/api_key.rs`中添加：
```rust
// 获取所有唯一的platform值
pub async fn get_all_platforms(pool: &SqlitePool) -> Result<Vec<String>, DatabaseError> {
    let platforms = sqlx::query_scalar::<_, String>("SELECT DISTINCT platform FROM api_keys WHERE platform IS NOT NULL")
        .fetch_all(pool)
        .await
        .map_err(|e| DatabaseError::SqlxError(e.to_string()))?;
    
    Ok(platforms)
}
```

2. 在`src-tauri/src/commands/api_key_commands.rs`中添加：
```rust
// 获取所有platform
#[tauri::command]
pub async fn get_all_platforms(
    state: State<'_, AppState>,
) -> Result<Vec<String>, String> {
    let pool = &state.db;
    get_all_platforms(pool).await.map_err(|e| e.to_string())
}
```

3. 在`src-tauri/src/lib.rs`中注册新命令：
```rust
.invoke_handler(tauri::generate_handler![
    // ...现有命令
    commands::api_key_commands::get_all_platforms,
])
```

### 4.2 前端代码修改

1. 在`src/services/apiKeyService.ts`中添加：
```typescript
// 获取所有platform
async getAllPlatforms(): Promise<ServiceResult<string[]>> {
    return executeOperation(
        () => invoke("get_all_platforms") as Promise<string[]>,
        OperationContext.API_KEY_SEARCH,
        { operation: 'get_platforms' }
    );
}
```

2. 修改`FloatingToolbar.tsx`中的径向菜单实现：
```typescript
// 添加状态管理
const [platforms, setPlatforms] = useState<string[]>([]);
const [visiblePlatforms, setVisiblePlatforms] = useState<string[]>([]);

// 获取所有platform
useEffect(() => {
    const loadPlatforms = async () => {
        if (showRadialMenu) {
            const res = await apiKeyService.getAllPlatforms();
            if (res.success) {
                setPlatforms(res.data || []);
                // 默认显示前8个
                setVisiblePlatforms((res.data || []).slice(0, 8));
            }
        }
    };
    loadPlatforms();
}, [showRadialMenu]);
```

3. 实现虚拟滚动菜单：
```typescript
// 使用VirtualList组件替换现有的径向菜单选项渲染
{activePanel === 'radial' && (
    <div className="floating-toolbar-radial-menu">
        <VirtualList
            items={platforms}
            renderItem={(platform, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => handlePlatformSelect(platform)}
                    className="radial-menu-option-button"
                >
                    <span className="radial-menu-option-content">
                        <span className="radial-menu-option-label">{platform}</span>
                    </span>
                </button>
            )}
            itemHeight={40}
            containerHeight={300}
            overscan={3}
            onScroll={handleScroll}
        />
    </div>
)}
```

4. 添加滚动控制逻辑：
```typescript
// 处理滚动事件
const handleScroll = useCallback(({ scrollTop, scrollDirection }: { scrollTop: number; scrollDirection: 'up' | 'down' }) => {
    // 根据滚动位置调整可见的platform列表
    const startIndex = Math.floor(scrollTop / 40);
    const endIndex = Math.min(startIndex + 8, platforms.length);
    setVisiblePlatforms(platforms.slice(startIndex, endIndex));
}, [platforms]);

// 处理鼠标悬浮滚动
const handleMouseHover = useCallback((position: 'top' | 'bottom') => {
    // 实现自动滚动逻辑
    if (position === 'top') {
        // 向上滚动
    } else {
        // 向下滚动
    }
}, []);
```

## 5. 测试计划
1. 验证新添加的Tauri命令能正确获取所有platform
2. 验证前端能正确显示从数据库获取的platform列表
3. 验证虚拟滚动功能正常工作
4. 验证鼠标悬浮滚动功能正常工作
5. 验证在不同数据量下的性能表现

## 6. 风险和解决方案
1. **性能问题**：大量platform可能导致渲染性能问题
   - 解决方案：使用虚拟滚动技术优化渲染

2. **数据一致性**：数据库中的platform可能包含无效或重复数据
   - 解决方案：在后端查询时进行数据清洗和去重

3. **UI适配问题**：不同数量的platform可能影响UI布局
   - 解决方案：动态调整菜单尺寸和布局