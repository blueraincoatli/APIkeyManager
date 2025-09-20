use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[allow(dead_code)]
pub struct Setting {
    pub key: String,
    pub value: String,
}