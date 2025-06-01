export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });
      console.log('this shit is called ----->01');

      if (!response.ok) {
        console.log('this shit is called ----->02');

        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message);
        return;
      }
      console.log('this shit is called ----->03');
      this.#authModel.putAccessToken(response.loginResult.token);

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      console.log('this shit is called ----->04');
      console.error('getLogin: error:', error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
