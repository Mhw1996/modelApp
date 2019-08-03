$(function(){
  foot_div_one = document.querySelector('.foot_div_one')
  foot_div_one.addEventListener('touchend', function(e) {
    e.preventDefault();
    // 将index_flow.html->index.html
    location.href = './index.html'
  });

  // foot_div_two = document.querySelector('.foot_div_two')
  // foot_div_two.addEventListener('touchend', function(e) {
  //   e.preventDefault();
  //   location.href = './classify.html?topid=0'
  // });

  foot_div_three = document.querySelector('.foot_div_three')
  foot_div_three.addEventListener('touchend', function(e) {
    e.preventDefault();
    location.href = './car.html'
  });

  foot_div_four = document.querySelector('.foot_div_four')
  foot_div_four.addEventListener('touchend', function(e) {
    e.preventDefault();
    location.href = './mine.html'
  });

})