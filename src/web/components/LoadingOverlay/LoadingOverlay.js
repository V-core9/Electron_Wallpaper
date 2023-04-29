const LoadingOverlay =  async () => {
  return `<modal class='appLoading'>
            <overlay></overlay>
            <inner>
              <header>
                <h2>LOADING...</h2>
              </header>
            </inner>
          </modal>`;
};

module.exports = LoadingOverlay;