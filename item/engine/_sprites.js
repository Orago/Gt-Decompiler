class sprites {
  constructor (){
    this.cache = {};
    this.loading = [];
  }

  clear (){
    this.cache = {};
    this.loading = [];
  }

  has (url){
    return this.cache.hasOwnProperty(url);
  }

  get (url){
    return this.has(url) ? this.cache[url] : this.loadSingle(url);
  }

  unset (url){
    if (this.has(url))
      delete this.cache[url];
  }

  loadSingle (url){
    const img = new Image();

    if (this.loading.includes(url)) return img;

    this.loading.push(url);

    img.src = url;

    img.onload = url => {
      this.loading = this.loading.filter(urlToRemove => urlToRemove === url);
    }

    return this.cache[url] = img;
  }

	async loadSinglePromise (url){
    const img = new Image();
		
		img.src = url;

		return new Promise((resolve, reject) => {
			img.onload = () => {
				this.cache[url] = img;

				resolve(img);
			};
			
			img.onerror = reject;
		});
	}

	async promise (url){
		return this.has(url) ? this.cache[url] : await this.loadSinglePromise(url);
	}
}

export default sprites;