angular.module('assetsApp').value('ordervar',
    {
        typeSearch: { id: ''},
        searchSubject: { number: '', fioAndName: ''},
        operationTypes: [{
            "prelabel": "",
            "label": "Гос. регистрация",
            "children": [{
                "prelabel": "Гос. регистрация",
                "label": "изменение"
            },{
                "prelabel": "Гос. регистрация",
                "label": "создание"
            }]
        }],
        selectedSubjects: [],
        bases: [{
            "prelabel": "",
            "label": "Выделение участка",
            "children": [{
                "prelabel": "Выделение участка",
                "label": "документ"
            },{
                "prelabel": "Выделение участка",
                "label": "создание"
            }]
        }],
        doctypes :[
            {id: 1, name: 'Авизо'},
            {id: 2, name: 'Акт'},
            {id: 3, name: 'Вид на жительство '},
            {id: 4, name: 'Выписка'},
            {id: 5, name: 'Государственный акт'},
            {id: 6, name: 'Доверенность'},
            {id: 7, name: 'Договор (соглашение)'},
            {id: 8, name: 'Заявление'},
            {id: 9, name: 'Землеустроительное дело'},
            {id: 10, name: 'Иной документ '},
            {id: 11, name: 'Определение'},
            {id: 12, name: 'Паспорт'},
            {id: 13, name: 'Предписание'},
            {id: 14, name: 'Приговор'}
        ],
        objecttypes:[
            {id: 1, name: 'Объект'},
            {id: 2, name: 'ПИК'},
            {id: 2, name: 'Право'},
            {id: 4, name: 'Доля'},
            {id: 5, name: 'Дело'},
            {id: 6, name: 'Право перехода'}
        ],
        items: null,
        typeClient: null,
        showModal: false,
        showPanel1P: false,
        showPanel2: false,
        showPanel3: false,
        showSubjectsTable: false,
        representativeActive: "",
        clientActive: "active",
        ates: [{label: 'loading'}],
        openVar: '',
        states: [],
        order: ""
    }
);
