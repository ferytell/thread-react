import { generateInDevelopmentTemplate } from '../../templates';

export default class InDEvelopmentPage {
  async render() {
    return `
      <section class="in-development">        
        <div class="sd">
      </section>
    `;
  }

  init() {
    document.getElementById('in-development').innerHTML = generateInDevelopmentTemplate;
  }
}
