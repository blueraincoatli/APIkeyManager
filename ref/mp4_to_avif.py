import os
import subprocess
import sys

def convert_mp4_to_avif(input_dir):
    """
    将指定目录下的所有MP4文件转换为AVIF动图
    """
    # 检查ffmpeg是否安装
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("错误: 请先安装ffmpeg")
        print("在Windows上可以使用: choco install ffmpeg")
        print("或在官网下载: https://ffmpeg.org/download.html")
        return
    
    # 获取目录中的所有MP4文件
    mp4_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.mp4')]
    
    if not mp4_files:
        print("在指定目录中未找到MP4文件")
        return
    
    print(f"找到 {len(mp4_files)} 个MP4文件，开始转换...")
    
    for mp4_file in mp4_files:
        input_path = os.path.join(input_dir, mp4_file)
        output_file = os.path.splitext(mp4_file)[0] + '.avif'
        output_path = os.path.join(input_dir, output_file)
        
        print(f"正在转换: {mp4_file} -> {output_file}")
        
        # 使用ffmpeg进行转换
        # 参数说明:
        # -i 输入文件
        # -c:v libaom-av1 使用AV1编码器
        # -crf 30 质量控制（值越小质量越好，文件越大）
        # -b:v 0 使用CRF模式而不是比特率模式
        # -pix_fmt yuv420p 像素格式
        # -f avif 输出格式为AVIF
        cmd = [
            'ffmpeg', '-i', input_path,
            '-c:v', 'libaom-av1',
            '-crf', '30',
            '-b:v', '0',
            '-pix_fmt', 'yuv420p',
            '-f', 'avif',
            output_path
        ]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"✓ 成功转换: {output_file}")
        except subprocess.CalledProcessError as e:
            print(f"✗ 转换失败: {mp4_file}")
            print(f"错误信息: {e.stderr.decode() if e.stderr else '未知错误'}")

if __name__ == "__main__":
    input_directory = r"D:\APIkeyManager\ref"
    
    if not os.path.exists(input_directory):
        print(f"目录不存在: {input_directory}")
    else:
        convert_mp4_to_avif(input_directory)
        print("所有转换完成！")
