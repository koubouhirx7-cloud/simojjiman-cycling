/**
 * Global Utility Functions
 * ------------------------
 * サイト全体で共通して使用する便利な道具箱です。
 */

/**
 * 文字列を安全にHTML表示用に変換する（XSS対策）
 * @param {string} str - 変換前の文字列
 * @returns {string} - 無害化された文字列
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
