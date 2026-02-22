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

/**
 * モバイルメニューの開閉制御
 */
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu nav a');

    function toggleMenu() {
        const isOpen = !mobileMenu.classList.contains('translate-x-full');
        if (!isOpen) {
            // Open
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.classList.remove('translate-x-full');
                mobileMenuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            // Close
            mobileMenu.classList.add('translate-x-full');
            mobileMenuBackdrop.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', toggleMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', toggleMenu);

    // リンククリック時に自動で閉じる
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                toggleMenu();
            }
        });
    });
});
