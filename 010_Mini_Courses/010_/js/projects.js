
// Projects 
// unsplashから欲しい画像を取得する方法
// https://source.unsplash.com/ + 欲しい画像のタイトル

const projects = [
  {
    name: "PROJECTS ONE",
    type: "WEB DESIGN",
    pos: "start",
    image: "https://source.unsplash.com/bIhpiQA009k"
  },
  {
    name: "PROJECTS 2",
    type: "WEB DEVELOPMENT",
    pos: "mid",
    image: "https://source.unsplash.com/RqfFauPXJx0",
  },
  {
    name: "PROJECTS 3",
    type: "WEB FRONTEND",
    pos: "end",
    image: "https://source.unsplash.com/V5qhgJN6do0",
  },
  {
    name: "PROJECTS 4",
    type: "WEB BACKEND",
    pos: "mid",
    image: "https://source.unsplash.com/vUJIKV6PBJQ",
  },
  {
    name: "PROJECTS 5",
    type: "WEB PRODUCTION",
    pos: "end",
    image: "https://source.unsplash.com/abjEGTj3HZY",
  },
  {
    name: "PROJECTS 6",
    type: "WEB JAVASCRIPT",
    pos: "mid",
    image: "https://source.unsplash.com/uDXqIIVhLcM",
  },
  {
    name: "PROJECTS 7",
    type: "WEB JAVASCRIPT",
    pos: "start",
    image: "https://source.unsplash.com/WXSmnpNzgPk",
  },
  {
    name: "PROJECTS 8",
    type: "WEB JAVASCRIPT",
    pos: "end",
    image: "https://source.unsplash.com/nVgU7sNDRg0",
  },
]

// スライダーに画像を挿入
const createProjects = () => {
  projects.forEach(project => {
    // スライダー1つ
    let panel = document.createElement("div");
    panel.classList.add("project", `${project.pos}`);

    // ※ classList、className の違い 
    // classList.add クラス名を追加する。removeで削除もできるしtoggleできたりもする
    // className     これを使えばクラスを全て書き換えることになる

    // 画像コンテナ
    let imageContainer = document.createElement("div");
    imageContainer.className = "image__container";

    // 画像
    let image = document.createElement("img");
    image.classList.add("project__image");
    image.src = project.image

    // 詳細コンテナ(タイトル + タイプ)
    let projectDetails = document.createElement("div");
    projectDetails.classList.add("project__details");

    // タイトル
    let projectTitle = document.createElement("p");
    projectTitle.innerText = project.name;

    // タイプ
    let projectType = document.createElement("p");
    projectType.innerText = project.type;

    // 画像コンテナ
    imageContainer.appendChild(image);

    // 詳細
    // append ... 複数要素を指定可能。返り値なし(undefinedを返す)
    // appendChild ... 追加する1つのNodeのみ指定可能。返り値あり。
    projectDetails.append(projectTitle, projectType);
    // projectDetails.appendChild(projectTitle);
    // projectDetails.appendChild(projectType);

    panel.append(imageContainer, projectDetails)
    // panel.appendChild(imageContainer)
    // panel.appendChild(projectDetails)
    // console.log(panel)

    document.querySelector(".projects__slider").appendChild(panel)
  })
}


// Blog posts
const blogSection = document.getElementById("js-blog");

const blogPosts = [
  {
    title: "BlOG POST ONE",
    time: "3 MIN",
    image: "https://source.unsplash.com/2JIvboGLeho",
  },
  {
    title: "BlOG POST TW O",
    time: "4 MIN",
    image: "https://source.unsplash.com/o0Qqw21-0NI",
  },
  {
    title: "BlOG POST THREE",
    time: "5 MIN",
    image: "https://source.unsplash.com/oqStl2L5oxI",
  },
]

const createBlogPosts = () => {
  blogPosts.forEach((post) => {
    let blogPostSection = document.createElement("div");
    blogPostSection.classList.add("blog__post");

    let postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.id = "js-post";

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("post__image__container");

    let image = document.createElement("img");
    image.classList.add("blog__post__img");
    image.src = post.image;

    let postDetails = document.createElement("div");
    postDetails.classList.add("post__details");

    let postTitle = document.createElement("p");
    postTitle.innerText = post.title;

    let postTime = document.createElement("p");
    postTime.innerText = post.time;

    imageContainer.appendChild(image);
    postDetails.append(postTitle, postTime);
    postDiv.append(imageContainer, postDetails);
    blogPostSection.appendChild(postDiv);

    blogSection.appendChild(blogPostSection);
  })
}


export {
  createProjects,
  createBlogPosts,
}


/**************************************************************
元のコード
***************************************************************/


// const projects = [
//   {
//     name: "PROJECTS ONE",
//     type: "WEB DESIGN",
//     pos: "start",
//     image: "https://source.unsplash.com/bIhpiQA009k"
//   },
//   {
//     name: "PROJECTS 2",
//     type: "WEB DEVELOPMENT",
//     pos: "mid",
//     image: "https://source.unsplash.com/RqfFauPXJx0",
//   },
//   {
//     name: "PROJECTS 3",
//     type: "WEB FRONTEND",
//     pos: "end",
//     image: "https://source.unsplash.com/V5qhgJN6do0",
//   },
//   {
//     name: "PROJECTS 4",
//     type: "WEB BACKEND",
//     pos: "mid",
//     image: "https://source.unsplash.com/vUJIKV6PBJQ",
//   },
//   {
//     name: "PROJECTS 5",
//     type: "WEB PRODUCTION",
//     pos: "end",
//     image: "https://source.unsplash.com/abjEGTj3HZY",
//   },
//   {
//     name: "PROJECTS 6",
//     type: "WEB JAVASCRIPT",
//     pos: "mid",
//     image: "https://source.unsplash.com/uDXqIIVhLcM",
//   },
//   {
//     name: "PROJECTS 7",
//     type: "WEB JAVASCRIPT",
//     pos: "start",
//     image: "https://source.unsplash.com/WXSmnpNzgPk",
//   },
//   {
//     name: "PROJECTS 8",
//     type: "WEB JAVASCRIPT",
//     pos: "end",
//     image: "https://source.unsplash.com/nVgU7sNDRg0",
//   },
// ]

// // スライダーに画像を挿入
// const createProjects = () => {
//   projects.forEach(project => {
//     // スライダー1つ
//     let panel = document.createElement("div");
//     panel.classList.add("project", `${project.pos}`);

//     // ※ classList、className の違い 
//     // classList.add クラス名を追加する。removeで削除もできるしtoggleできたりもする
//     // className     これを使えばクラスを全て書き換えることになる

//     // 画像コンテナ
//     let imageContainer = document.createElement("div");
//     imageContainer.className = "image__container";

//     // 画像
//     let image = document.createElement("img");
//     image.classList.add("project__image");
//     image.src = project.image

//     // 詳細コンテナ(タイトル + タイプ)
//     let projectDetails = document.createElement("div");
//     projectDetails.classList.add("project__details");

//     // タイトル
//     let projectTitle = document.createElement("p");
//     projectTitle.innerText = project.name;

//     // タイプ
//     let projectType = document.createElement("p");
//     projectType.innerText = project.type;

//     // 画像コンテナ
//     imageContainer.appendChild(image);

//     // 詳細
//     // append ... 複数要素を指定可能。返り値なし(undefinedを返す)
//     // appendChild ... 追加する1つのNodeのみ指定可能。返り値あり。
//     projectDetails.append(projectTitle, projectType);
//     // projectDetails.appendChild(projectTitle);
//     // projectDetails.appendChild(projectType);

//     panel.append(imageContainer, projectDetails)
//     // panel.appendChild(imageContainer)
//     // panel.appendChild(projectDetails)
//     // console.log(panel)

//     document.querySelector(".projects__slider").appendChild(panel)
//   })
// }


// // Blog posts
// const blogPosts = [
//   {
//     title: "BlOG POST ONE",
//     time: "3 MIN",
//     image: "https://source.unsplash.com/2JIvboGLeho",
//   },
//   {
//     title: "BlOG POST TW O",
//     time: "4 MIN",
//     image: "https://source.unsplash.com/o0Qqw21-0NI",
//   },
//   {
//     title: "BlOG POST THREE",
//     time: "5 MIN",
//     image: "https://source.unsplash.com/oqStl2L5oxI",
//   },
// ]

// const createBlogPosts = () => {
//   blogPosts.forEach((post) => {
//     let blogPostSection = document.createElement("div");
//     blogPostSection.classList.add("blog__post");

//     let postDiv = document.createElement("div");
//     postDiv.classList.add("post");

//     let imageContainer = document.createElement("div");
//     imageContainer.classList.add("post__image__container");

//     let image = document.createElement("img");
//     image.classList.add("blog__post__img");
//     image.src = post.image;

//     let postDetails = document.createElement("div");
//     postDetails.classList.add("post__details");

//     let postTitle = document.createElement("p");
//     postTitle.innerText = post.title;

//     let postTime = document.createElement("p");
//     postTime.innerText = post.time;

//     imageContainer.appendChild(image);
//     postDetails.append(postTitle, postTime);
//     postDiv.append(imageContainer, postDetails);
//     blogPostSection.appendChild(postDiv);

//     document.getElementById("blog").appendChild(blogPostSection);
//   })
// }



// export {
//   createProjects,
//   createBlogPosts,
// }