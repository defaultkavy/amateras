export function parseMatrix2D(matrixString: string) {
    const fallback = { x: 0, y: 0, scaleX: 1, scaleY: 1, angle: 0 };
    if (!matrixString || matrixString === 'none') return fallback;

    // 提取出 [a, b, c, d, e, f]
    const values: Repeat<number, 6> = matrixString.split('(')[1]!.split(')')[0]!.split(',').map(Number) as any;
    const [a, b, c, d, e, f] = values;

    // 1. 平移绝对是最后两个
    const x = e;
    const y = f;

    // 2. 逆向推算缩放和旋转
    const scaleX = Math.sqrt(a * a + b * b);
    const scaleY = Math.sqrt(c * c + d * d);
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    return { x, y, scaleX, scaleY, angle };
}