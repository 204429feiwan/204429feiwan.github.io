// 简易轮播器（支持触摸/鼠标拖拽 + 自动轮播）
document.addEventListener('DOMContentLoaded', function () {
  const sliderContainer = document.querySelector('.slider-container');
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.dot');
  const totalSlides = slides.length;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let diffX = 0;

  // 初始化：设置第一张为激活
  updateDots();
  sliderContainer.style.transform = `translateX(0)`;

  // 更新圆点状态
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // 移动到指定索引
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  // 自动轮播（可选，取消注释启用）
  // let autoSlideInterval;
  // function startAutoSlide() {
  //   autoSlideInterval = setInterval(() => {
  //     goToSlide(currentIndex + 1);
  //   }, 3000);
  // }
  // function stopAutoSlide() {
  //   clearInterval(autoSlideInterval);
  // }
  // sliderContainer.addEventListener('mouseenter', stopAutoSlide);
  // sliderContainer.addEventListener('mouseleave', startAutoSlide);
  // startAutoSlide();

  // 触摸/鼠标开始
  sliderContainer.addEventListener('mousedown', handleStart);
  sliderContainer.addEventListener('touchstart', handleStart);

  function handleStart(e) {
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    // 停止自动轮播（如果启用了）
    // stopAutoSlide();
  }

  // 触摸/鼠标移动
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove);

  function handleMove(e) {
    if (!isDragging) return;
    currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    diffX = currentX - startX;
    sliderContainer.style.transform = `translateX(${diffX}px)`;
  }

  // 触摸/鼠标结束
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);

  function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    // 判断滑动方向：超过阈值则切换
    const threshold = 50; // 滑动距离阈值（像素）
    if (diffX > threshold) {
      // 向右滑 → 上一张
      goToSlide(currentIndex - 1);
    } else if (diffX < -threshold) {
      // 向左滑 → 下一张
      goToSlide(currentIndex + 1);
    } else {
      // 未达阈值，回弹
      sliderContainer.style.transition = 'transform 0.3s';
      sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        sliderContainer.style.transition = '';
      }, 300);
    }

    diffX = 0;
  }

  // 点击圆点切换
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // 键盘方向键支持（PC端）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
  });
});