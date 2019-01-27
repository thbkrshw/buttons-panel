import { PanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';
import './css/buttons-panel.css';
import uuidv4 from 'uuid/v4';

export class ButtonsCtrl extends PanelCtrl {
    static templateUrl = 'partials/module.html';

    panelDefaults = {
        buttons: [],
        bgColor: null,
    };


    /** @ngInject */
    constructor($scope, $injector, public $http, public $timeout) {
        super($scope, $injector);
        _.defaultsDeep(this.panel, this.panelDefaults);


        // this.AddButton();

        this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
        this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
        this.events.on('panel-initialized', this.render.bind(this));
        this.events.on('component-did-mount', this.render.bind(this));
        // this.events.on('refresh', );
        // this.events.on('render', );

        var panel = this.panel;


        $scope.Action = function (id: string) {

            var button = panel.buttons.find(b => b.id == id);;
            if (!button) {
                return;
            }

            var headers = {}
            if (button.request.auth.status) {
                headers['Authorization'] = "Basic " + btoa(button.request.auth.username + ":" + button.request.auth.password);
            }

            console.log(headers);

            $http({
                method: button.request.method,
                url: button.request.url,
                headers: headers,
                data: button.request.body
            }).then(function successCallback(response) {
                button.color = "green";
                console.log(response);
                $timeout(function () { button.color = "#e3e3e3" }, 150);
                $scope.$root.appEvent('alert-success', ['Test', '']);
            }, function errorCallback(response) {
                button.color = "red";
                $timeout(function () { button.color = "#e3e3e3" }, 150);
                console.error(response);
            });
        }

    }


    onInitEditMode() {
        this.addEditorTab('Options', 'public/plugins/thbkrshw-buttons-panel/partials/options.html', 2);
    }

    onPanelTeardown() {

    }

    link(scope, elem) {
        this.events.on('render', () => {
            const $panelContainer = elem.find('.panel-container');

            if (this.panel.bgColor) {
                $panelContainer.css('background-color', this.panel.bgColor);
            } else {
                $panelContainer.css('background-color', '');
            }
        });
    }

    createButton() {
        return {
            id: uuidv4(),
            name: "Foo?!",
            color: "#e3e3e3",
            request: {
                url: "http://httpbin.org/ip",
                method: "GET",
                body: "",
                headers: [],
            }
        }
    }



    AddButton() {
        let button = this.createButton();
        this.panel.buttons.push(button);
        console.log(this.panel.buttons);
    }

    ClearButtons() {
        this.panel.buttons = new Array();
    }

    RemoveButton(id: string) {
        this.panel.buttons = this.panel.buttons.filter(b => b.id != id);
    }

    GetButtonById(id: string) {
        return this.panel.buttons.find(b => b.id == id);
    }

    // DuplicateButton(id: string) {
    //     let button = this.panel.buttons.find(b => b.id == id)
    //     console.log(button);
    //     if (button != undefined) {
    //         let newButton = Object.create(button);
    //         newButton["id"] = uuidv4();
    //         console.log(newButton);
    //         this.panel.buttons.push(newButton);
    //     } else {
    //         console.log("unable to find button #" + id);
    //     }
    // }
}
