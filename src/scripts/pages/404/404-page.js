export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <div class="container">
          <div class="not-found__content">
            <img src="images/404.png" alt="404 Not Found" class="not-found__image" />

            <h1>404 - Page Not Found</h1>
            <p>Sowwry, the page you're looking for doesn't exist or has been moved.</p>
            <br/>
            <a href="#/" class="btn">Return to Home</a>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // You can add any additional initialization code here if needed
  }
}
