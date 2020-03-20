var app = new Vue({
    el: '#app',
    data: {
        attrs: [],
        sizeData: [],
        rowNum: 0,
        colNum: 0,
        tableData: [],
    },
    methods: {
        inputFile(e) {
            //給input標籤繫結change事件，一上傳選中的.xls檔案就會觸發該函式

            var vm = this;
            vm.attrs = [];
            vm.sizeData = [];
            vm.tableData = [];
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
                vm.attrs = Object.keys(persons[0]);
                vm.sizeData = persons;
            };
        },
        // 吋轉公分，進位(可以分出來當一個 function)
        conversionToCm(inches) {
            const vm = this;
            const toCm = (inches * 2.54).toFixed(1);
            const separate = vm.separationNum(toCm);

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

       
        
    },
    computed: {
        getLen() {
            const vm = this;
            vm.rowNum = vm.attrs.length;
            vm.colNum = vm.sizeData.length;
        },
        toCm() {
            const vm = this;
            for (let i = 0; i < vm.colNum; i++) {
                for (let j = 1; j < vm.rowNum; j++) {
                    vm.sizeData[i][vm.attrs[j]] = vm.conversionToCm(vm.sizeData[i][vm.attrs[j]]);
                }
            };
        },
        createTable() {
            const vm = this;
            for (let i = 0; i < vm.rowNum; i++) {
                vm.tableData.push([vm.attrs[i]]);
                for (let j = 0; j < vm.colNum; j++) {
                    vm.tableData[i].push(vm.sizeData[j][vm.attrs[i]]);
                }
            } 
        }

    },
});



