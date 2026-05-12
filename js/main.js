// 浙里风光网站主脚本
// 页面基本功能和交互

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSearch();
    initBackToTop();
    initAnnouncementControls();
    initBannerAd();
});

// 导航菜单功能
function initNavigation() {
    // 高亮当前页面导航
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (!searchInput || !searchBtn) return;

    // 搜索按钮点击
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            alert('搜索 "' + query + '" 的功能正在开发中...');
        } else {
            alert('请输入搜索关键词');
        }
    });

    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// 返回顶部功能
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (!backToTopBtn) return;

    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 公告栏控制功能
function initAnnouncementControls() {
    const pauseBtn = document.getElementById('pause-btn');
    const playBtn = document.getElementById('play-btn');
    const marqueeContent = document.querySelector('.marquee-content');

    if (!pauseBtn || !playBtn || !marqueeContent) return;

    let isPaused = false;

    // 暂停公告
    pauseBtn.addEventListener('click', function() {
        marqueeContent.style.animationPlayState = 'paused';
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline-block';
        isPaused = true;
    });

    // 播放公告
    playBtn.addEventListener('click', function() {
        marqueeContent.style.animationPlayState = 'running';
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        isPaused = false;
    });

    // 点击公告区域时暂停/播放
    document.querySelector('.announcement-bar').addEventListener('click', function(e) {
        if (e.target.closest('.announcement-controls')) return;

        if (isPaused) {
            playBtn.click();
        } else {
            pauseBtn.click();
        }
    });
}


// 横幅广告功能
function initBannerAd() {
    const adBtn = document.querySelector('.ad-btn');

    if (!adBtn) return;

    // 广告按钮点击事件
    adBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // 创建预订表单弹窗
        showBookingModal();

        // 或者滚动到预订区域
        // const bookingSection = document.getElementById('book-now');
        // if (bookingSection) {
        //     bookingSection.scrollIntoView({ behavior: 'smooth' });
        // }
    });
}

// 显示预订弹窗
function showBookingModal() {
    // 创建模态框
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        ">
            <h3 style="color: #ff6b6b; margin-bottom: 15px; font-size: 1.5rem;">🎯 立即预订优惠门票</h3>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.5;">
                千岛湖、雁荡山、西湖等热门景点<br>
                <strong style="color: #ff6b6b; font-size: 1.2rem;">8折起限时优惠！</strong>
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="this.closest('.modal-overlay').remove()" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">立即预订</button>
                <button onclick="this.closest('.modal-overlay').remove()" style="
                    background: #f5f5f5;
                    color: #666;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                ">稍后再说</button>
            </div>
        </div>
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    modal.className = 'modal-overlay';

    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}

// 视频播放器功能