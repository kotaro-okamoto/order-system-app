export default {

  methods: {
    changeLocale: function (lang) {
      this.$i18n.locale = lang;
    },
    groupBy: function (groupByKeyString, DbData) {
      let keyGetter = arg => arg[groupByKeyString]

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
          index: mapToArray.indexOf(element),
          groupByValue: categoryNameValue,
          products: productJson
        })
      }
      return resultJson;
    },
    groupsGroupBy: function (groupKeyString, DbData) {
      let keyGetter = arg => arg[groupKeyString]

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
    },
    createRandomId: function () {
      // 生成する文字列の長さ
      let returnValuelength = 12;

      // 生成する文字列に含める文字セット
      let candidateStringList =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNMNOPQRSTUVWXYZ123456789";

      let candidateStringListLength = candidateStringList.length;
      let returnValue = "";
      for (var i = 0; i < returnValuelength; i++) {
        returnValue +=
          candidateStringList[
          Math.floor(Math.random() * candidateStringListLength)
          ];
      }
      return returnValue;
    },
  }
}