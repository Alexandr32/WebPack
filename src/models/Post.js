export default class Post {
    constructor(title, img) {
        this.title = title;
        this.img = img;
        this.date = new Date();
    }

    toString() {
        /** Оборачивает объект в строку */
        return JSON.stringify({
            title: this.title,
            data: this.date.toJSON(),
            img: this.img
        }, null, 2)
    }
}