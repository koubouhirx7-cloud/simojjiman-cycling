/**
 * MicroCMS Blog Integration Script (Notion Style)
 * ---------------------------------------------
 * 村上さんのブログをNotion風に整理して表示する司令塔です。
 */

const MICROCMS_DOMAIN = "c1hyze94lo";
const MICROCMS_API_KEY = "lsav21va5wjfZhLC7mU5u8kG4ARJ6V5BPFSS";
const BLOG_API_ENDPOINT = `https://${MICROCMS_DOMAIN}.microcms.io/api/v1/blogs`;

let allPosts = [];
let currentFilter = 'all'; // 'all', 'year', 'month', 'week'

/**
 * ブログ記事一覧を取得して表示する
 */
async function fetchBlogPosts() {
    try {
        const response = await fetch(BLOG_API_ENDPOINT, {
            headers: {
                "X-MICROCMS-API-KEY": MICROCMS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`microCMS通信エラー: ${response.status}`);
        }

        const data = await response.json();
        allPosts = data.contents;
        updateView('all');
    } catch (error) {
        console.error("ブログ取得失敗:", error);
        document.getElementById("blog-list-container").innerHTML =
            '<p class="text-red-500">ブログの読み込みに失敗しました。</p>';
    }
}

/**
 * 表示を更新する（フィルター切り替え）
 */
function updateView(filter) {
    currentFilter = filter;

    // タブの見た目を更新
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.dataset.filter === filter) {
            tab.classList.add('bg-primary', 'text-white');
            tab.classList.remove('bg-gray-100', 'text-gray-600');
        } else {
            tab.classList.remove('bg-primary', 'text-white');
            tab.classList.add('bg-gray-100', 'text-gray-600');
        }
    });

    renderBlogGrid(allPosts, filter);
}

/**
 * 期間でグループ化して表示する
 */
function renderBlogGrid(posts, filter) {
    const container = document.getElementById("blog-list-container");
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<p class="text-gray-500">現在、新しい記事はありません。</p>';
        return;
    }

    let groups = {};

    posts.forEach(post => {
        const date = new Date(post.publishedAt || post.createdAt);
        let key = "すべて";

        if (filter === 'year') {
            key = `${date.getFullYear()}年`;
        } else if (filter === 'month') {
            key = `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
        } else if (filter === 'week') {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            key = `${startOfWeek.getFullYear()}年 ${startOfWeek.getMonth() + 1}月 第${Math.ceil(date.getDate() / 7)}週`;
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(post);
    });

    let html = "";
    const filteredPosts = posts.slice(0, 3); // トップページでは最新3件のみに絞る

    for (const groupName in groups) {
        if (filter !== 'all') {
            html += `<h3 class="col-span-full text-lg font-bold mt-12 mb-6 flex items-center gap-2">
                        <span class="size-2 bg-primary rounded-full"></span>
                        ${groupName}
                     </h3>`;
        }

        // グループ内の各投稿をレンダリング。ただし全体で3件まで
        const postsToRender = groups[groupName].filter(p => filteredPosts.find(fp => fp.id === p.id));
        html += postsToRender.map(post => renderPostCard(post)).join("");
    }

    if (posts.length > 3) {
        html += `
            <div class="col-span-full flex justify-center mt-12">
                <a href="blog_archive.html" class="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                    過去の活動記録をすべて見る
                    <span class="material-symbols-outlined text-base">arrow_forward</span>
                </a>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Notion風カードのHTML生成
 */
function renderPostCard(post) {
    const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString("ja-JP");
    return `
        <article class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all flex flex-col group h-full shadow-sm hover:translate-y-[-2px]">
            <a href="blog_detail.html?id=${post.id}" class="block flex-1">
                ${post.eyecatch ? `
                    <div class="aspect-video overflow-hidden border-b border-gray-100">
                        <img src="${post.eyecatch.url}" alt="${post.title}" class="w-full h-full object-cover">
                    </div>
                ` : `
                    <div class="aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100">
                        <span class="material-symbols-outlined text-gray-300 text-4xl">article</span>
                    </div>
                `}
                <div class="p-5">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Blog</span>
                        <time class="text-[11px] text-gray-400 font-medium">${date}</time>
                    </div>
                    <h4 class="text-base font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors mb-2">${post.title}</h4>
                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">${post.content.replace(/<[^>]*>?/gm, '')}</p>
                </div>
            </a>
            <div class="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
                <span class="text-[10px] text-gray-400">Read More →</span>
                <div class="flex -space-x-1">
                    <div class="size-4 rounded-full bg-gray-200 border border-white"></div>
                </div>
            </div>
        </article>
    `;
}

// 初期化
document.addEventListener("DOMContentLoaded", () => {
    fetchBlogPosts();

    // イベントリスナーのセット（タブ切り替え）
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            updateView(e.target.dataset.filter);
        }
    });
});
