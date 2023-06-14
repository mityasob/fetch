const debounce = (fn, debounceTime, value) => {
  let timer = this.lastCall;
  this.lastCall = Date.now();
  if (this.lastCall - timer <= debounceTime) {
    clearTimeout(delay);
  }
  delay = setTimeout(() => {
      fn(value);
    }, debounceTime); 
};

let repList = document.querySelector(".rep-list");
let repInfoList = document.querySelector(".rep-info-list");

let arr;
let search = function (url) {
  let query = fetch(`https://api.github.com/search/repositories?q=${url}`);
  query.then(res => {
    return res.json();
  }).then(res => {
    arr = res.items.slice(0, 5);
    arr.forEach((element, index) => {
      repList.children[index].setAttribute("style", "padding-left: 13px; padding-bottom: 9px; border: 2px solid black;");
      repList.children[index].textContent = element.name;
    });
    repInfoList.removeAttribute("style");
  })
} 

let clearInput = function(list) {
  input.value = "";
  for (let el of list) {
    el.removeAttribute("style");
    el.textContent = "";
  }
  repInfoList.setAttribute("style", "transform: translate(0px, 240px);")
}

let input = document.querySelector(".search-field");
input.addEventListener("input", () => {
  if (input.value === " ") {
    input.value = "";
  }
  if (input.value) {
    debounce(search, 500, input.value);
  } else {
    debounce(clearInput, 500, repList.children);
  }
});

let repListArr = Array.from(repList.children);

repListArr.forEach ((el, index) => {
  el.addEventListener("click", () => {
    let li = document.createElement("li");
    li.classList.add("rep-info");
    li.innerHTML = "<p>Name: " + arr[index].name + "</p><p>Owner: " + arr[index].owner.login + "</p><p>Stars: " + arr[index].stargazers_count;
    let closeButton = document.createElement("div");
    closeButton.classList.add("close-button");
    li.appendChild(closeButton);
    let firstStick = document.createElement("div");
    firstStick.classList.add("first-stick");
    closeButton.appendChild(firstStick);
    let secondStick = document.createElement("div");
    secondStick.classList.add("second-stick");
    closeButton.appendChild(secondStick);
    closeButton.addEventListener("click", () => {
      li.remove();
    })
    repInfoList.appendChild(li);
    debounce(clearInput, 500, repList.children);
  });
});
