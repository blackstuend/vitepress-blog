<template>
  <div class="banner">
    <div class="banner__box">
      <h2 class="banner__title">
        Lucian's Blog
      </h2>
      <p class="banner__intro">
        Welcome to my blog
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.banner {
  background-image: url('https://images.unsplash.com/photo-1522021140916-00ca89bfe033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-position: center;
  background-size: cover;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__title {
    color: white;
    font-size: 3rem;
    text-align: center;
  }

  //  讓 intro 產生打字效果且有閃爍的光標
  &__intro {
    color: white;
    font-size: 1.5rem;
    text-align: center;
    overflow: hidden; /* Ensures the content is not revealed until the animation */
    border-right: .15em solid orange; /* The typewriter cursor */
    white-space: nowrap; /* Keeps the content on a single line */
    margin: 30px auto; /* Gives that scrolling effect as the typing happens */
    width: 245px;
    animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 245px }
  }
}
</style>
