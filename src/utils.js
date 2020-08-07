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
    // deleteCollection: function (collectionRef) {
    //   const admin = admin.firestore.Firestore;
    //   admin.initializeApp({
    //     credential: admin.credential.cert("/path/to/key.json"),
    //     databaseURL: 'https://xxxxxxxxxx.firebaseio.com',
    //   });
    //   const db = admin.firestore();

    //   const batchSize = 500;

    //   //firebaseのサイトにあるコード（少し改修）
    //   const query = collectionRef.orderBy('__name__').limit(batchSize);
    //   return new Promise((resolve, reject) => {
    //     this.deleteQueryBatch(db, query, batchSize, resolve, reject);
    //   });
    // },
    // deleteQueryBatch: function (db, query, batchSize, resolve, reject) {
    //   //削除のメインコード
    //   query.get()
    //     .then((snapshot) => {

    //       //検索結果が0件なら処理終わり
    //       if (snapshot.size == 0) {
    //         return 0;
    //       }

    //       //削除のメイン処理
    //       const batch = db.batch();
    //       snapshot.docs.forEach(doc => {
    //         batch.delete(doc.ref);
    //       });

    //       //一旦処理サイズをreturn
    //       return batch.commit().then(() => {
    //         return snapshot.size;
    //       })
    //     })
    //     .then((numDeleted) => {

    //       //もう対象のデータが0なら処理終わり
    //       if (numDeleted == 0) {
    //         resolve();
    //         return;
    //       }

    //       //あだあるなら、再度処理
    //       process.nextTick(() => {
    //         this.deleteQueryBatch(db, query, batchSize, resolve, reject);
    //       });
    //     })
    //     .catch(reject);
    // }
  }
}