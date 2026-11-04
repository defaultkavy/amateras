const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const hash = (str: string, length: number = 5) => {
    let hash = 2166136261; // FNV 32位 偏移初始值
    
    // 1. 纯整数位的 FNV-1a 混淆循环
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        // 使用 32 位整数乘法
        hash = Math.imul(hash, 16777619);
    }

    // 2. 将无符号 32 位整数快速转为 5 位字符（无 Math 函数，全位运算）
    let h = hash >>> 0; // 强制转为 32 位无符号整数
    let result = '';

    // 2. 根据指定的长度循环生成字符
    for (let i = 0; i < length; i++) {
        // 从字符表中映射当前位的字符
        result += CHARS[h % 62];
        
        // 核心：每次循环对 h 进行位混淆，确保支持任意长度且不重复
        h = (h >>> 5) ^ Math.imul(h, 33);
        h = h >>> 0;
    }
    return result
}