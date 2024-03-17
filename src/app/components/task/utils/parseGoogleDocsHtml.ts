export const parseGoogleDocsHtml = (html: string) => {
  const parser = new DOMParser();

  const dom = parser.parseFromString(html, "text/html");
  const body = dom.querySelector("body");

  //@ts-ignore
  const liElements = [...body.querySelectorAll("li")];

  const liData = liElements.map((v) => ({
    level: Number(v.getAttribute("aria-level")),
    isCheckbox: !!v.querySelector("[aria-roledescription='체크박스']"),
    text: v.querySelector("span").innerHTML,
  }));
  // const liData = [
  //   { level: 1, isCheckbox: true, text: '프론트엔드' },
  //   { level: 2, isCheckbox: true, text: '리액트' },
  //   { level: 3, isCheckbox: true, text: 'todo 만들기' },
  //   { level: 3, isCheckbox: true, text: 'zustand 만들기' },
  //   { level: 2, isCheckbox: true, text: 'vue' },
  //   { level: 2, isCheckbox: true, text: 'solid js' },
  //   { level: 1, isCheckbox: true, text: '브라우저' },
  //   { level: 1, isCheckbox: false, text: '웹 소켓' },
  //   { level: 2, isCheckbox: false, text: '웹 소켓 만들기' },
  //   { level: 3, isCheckbox: true, text: 'socket io 사용하기' }
  // ]

  let last: string[] = [];
  const data: string[] = [];

  liData.forEach((current) => {
    console.log(current.level, last.length);
    if (current.level > last.length) {
      // 레벨 증가
      last.push(current.text);
      if (current.isCheckbox) data.push(last.join(" > "));
      return;
    }

    if (current.level === last.length) {
      last.pop();
      last.push(current.text);
      if (current.isCheckbox) data.push(last.join(" > "));
      return;
    }

    if (current.level < last.length) {
      const diff = last.length - current.level + 1;
      console.log(current.text, diff);
      Array(diff)
        .fill(true)
        .forEach(() => {
          last.pop();
        });
      last.push(current.text);
      if (current.isCheckbox) data.push(last.join(" > "));
    }
  });

  return data;
};
