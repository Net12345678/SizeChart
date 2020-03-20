var app = new Vue({
    el: '#app',
    data: {
        attrs: [],
        sizeTableData: [],
    },
    methods: {
        inputFile(e) {
            //給input標籤繫結change事件，一上傳選中的.xls檔案就會觸發該函式
            var files = e.target.files;
            var fileReader = new FileReader();
            fileReader.readAsBinaryString(files[0]);
            fileReader.onload = function (ev) {
                try {
                    var data = ev.target.result
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    }) // 以二進位制流方式讀取得到整份excel表格物件
                    var persons = []; // 儲存獲取到的資料
                } catch (e) {
                    console.log('檔案型別不正確');
                    return;
                }
                // 表格的表格範圍，可用於判斷表頭是否數量是否正確
                var fromTo = '';
                // 遍歷每張表讀取
                for (var sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        fromTo = workbook.Sheets[sheet]['!ref'];
                        console.log(fromTo);
                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        break; // 如果只取第一張表，就取消註釋這行
                    }
                }
                //在控制檯打印出來表格中的資料
                this.attrs = Object.keys(persons[0]);
                this.sizeTableData = persons;
                console.log(this.attrs, this.sizeTableData);
            };
        },
        // 吋轉公分，進位(可以分出來當一個 function)
        conversionToCm(inches) {
            const toCm = (inches * 2.54).toFixed(1);
            const separate = separationNum(toCm);

            // 分出來當一個 function
            if (separate[1] < 0.3) {
                separate[1] = 0;
            } else if (separate[1] >= 0.3 && separate[1] <= 0.7) {
                separate[1] = 0.5;
            } else if (separate[1] > 0.7) {
                separate[1] = 1;
            }

            const totalNum = separate.reduce(function (prev, element) {
                return prev + element;
            }, 0);

            return totalNum;
        },

        // 分離整數和小數點
        separationNum(num) {
            const integer = Math.floor(num);
            const decimalPoint = ((num * 10) - (integer * 10)) / 10;

            return [integer, decimalPoint];
        },

        // 輸出處理好的 table 資料
        toCmTable(attrAry, valueAry) {
            const value = valueAry;
            const attr = attrAry;
            const row = value.length;
            const col = attr

            const allData = [];
            const line = [];


            // allData: [
            //   ["尺寸", "XS", "S", "M"],
            //   ["肩寬", 1, 2, 3],
            //   ["胸寬", 4, 5, 6]
            // ],

            // 跑雙迴圈不優，想一下怎改效能較好
            // for (let i = 0; i < value.length; i++) {
            //   for (let j = 1; j < attr.length; j++) {
            //     cmTable.push(conversionToCm(value[i][attr[j]]));
            //   }

            // }
            // for (let i = 0; i < value.length; i++) {
            //   sizeTable.push((value[i][attr[0]]));
            // }

            // // console.log(cmTable); 
            // // console.log(sizeTable);
        },
    }
});



