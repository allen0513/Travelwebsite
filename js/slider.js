// 浙里风光网站轮播图功能

// 轮播图变量
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// 初始化轮播图
function initSlider() {
    if (slides.length === 0) return;

    // 显示第一张图片
    showSlide(0);

    // 开始自动播放
    startAutoPlay();

    // 绑定事件
    bindSliderEvents();
}

function bindSliderEvents() {
    // 圆点点击事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // 左右按钮
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
}

function showSlide(index) {
    // 隐藏所有图片
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // 取消所有圆点的激活状态
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // 显示当前图片和圆点
    slides[index].classList.add('active');
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
}

function goToSlide(index) {
    showSlide(index);
    resetAutoPlay();
}

function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 2000); // 2秒切换
}

function stopAutoPlay() {
    clearInterval(slideInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initSlider);