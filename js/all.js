var app = new Vue({
    el:'#app',
    data: {
        allData:[
            ["尺寸","28","29","30","31","32","33","34","35","36","38","40"],
            ["腰圍",38,39.5,40.5,42,43,44.5,45.5,47,48,51,53.5],
            ["臀圍",47.5,48.5,50,51,52.5,53.5,55,56,57.5,60,62.5],
            ["腿圍",28.5,29,30,30.5,31,31.5,32.5,33,33.5,35,36]
        ],
        oupputData: ''
    },    
    
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
        },
        outputEDMHtml() {
			const preview = document.getElementById('preview');
			this.oupputData = preview.firstChild.outerHTML;
		}
    } 
});