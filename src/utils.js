export default {

  methods: {
    changeLocale: function (lang) {
      this.$i18n.locale = lang;
    },
    menusGroupBy: function (DbData) {
      let keyGetter = arg => arg.category

      const map = new Map();
      DbData.forEach((item) => {
        let parsedItem = JSON.parse(item)
        const key = keyGetter(parsedItem);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [parsedItem]);
        } else {
          collection.push(parsedItem);
        }
      });
      let resultJson = [];
      let mapToArray = [...map]
      for (let element of mapToArray) {
        let categoryNameValue = element[0]
        let productJson = element[1]
        resultJson.push({
          categoryId: mapToArray.indexOf(element),
          categoryName: categoryNameValue,
          products: productJson
        })
      }
      return resultJson;
    }
  }
}