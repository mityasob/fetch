const repList = document.createElement("ul");
repList.classList.add("rep-list");
const repInfoList = document.querySelector(".rep-info-list");
const hint = document.createElement("div");
hint.classList.add("hint");
const input = document.querySelector(".search-field");

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

class NoSuchRepository extends Error {
  constructor(message) {
    super(message);
    this.name = "NoSuchRepository";
  }
}

const search = function (url) {
  let query = fetch(`https://api.github.com/search/repositories?q=${url}`);
  query
    .then((res) => {
      if (res.status >= 400) {
        throw new Error("Error. Try again");
      }
      return res.json();
    })
    .then((res) => {
      let arr = res.items.slice(0, 5);
      if (arr.length === 0) {
        throw new NoSuchRepository("No Such Repository");
      }
      input.after(repList);
      arr.forEach((el, index) => {
        let rep = document.createElement("li");
        rep.classList.add("rep");
        repList.appendChild(rep);
        rep.textContent = el.name;
        rep.addEventListener("click", () => {
          let li = document.createElement("li");
          li.classList.add("rep-info");
          li.innerHTML =
            "<p>Name: " +
            arr[index].name +
            "</p><p>Owner: " +
            arr[index].owner.login +
            "</p><p>Stars: " +
            arr[index].stargazers_count;
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
          });
          repInfoList.appendChild(li);
          debounce(clearInput, 500, repList);
        });
      });
      repInfoList.removeAttribute("style");
    })
    .catch((err) => {
      hint.textContent = err.message;
      input.after(hint);
      debounce(clearInput, 500, repList);
    });
};

const clearInput = function (list) {
  input.value = "";
  list.innerHTML = "";
  repInfoList.setAttribute("style", "transform: translate(0px, 240px);");
};

input.addEventListener("input", () => {
  if (input.value === " ") {
    input.value = "";
  }
  if (input.value) {
    hint.remove();
    debounce(search, 500, input.value);
  } else {
    debounce(clearInput, 500, repList);
  }
});
