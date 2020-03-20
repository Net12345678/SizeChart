var app = new Vue({
    el:'#app',
    data: {},
    methods:{
       inputFile(e){
            //給input標籤繫結change事件，一上傳選中的.xls檔案就會觸發該函式
            var files = e.target.files;
            var fileReader = new FileReader();
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
            const idList = Object.keys(persons[0]);
            console.log(idList);
            console.log(persons);

            };
            // 以二進位制方式開啟檔案
            fileReader.readAsBinaryString(files[0]);
        }
    } 
});