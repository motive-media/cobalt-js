'use strict';

describe('cbSelectReplace', function() {
    beforeEach(module('cbSelectReplace'));

    var element, $compile, $scope, selectRoot;

    beforeEach(inject(function(_$compile_, $rootScope){
        $compile = _$compile_;
        $scope = $rootScope.$new();
        element = $compile('<div></div>')($scope);
    }));

    it('should replace a select root', function() {
        selectRoot = angular.element('<select class="cb-select-replace" name="testing_select" tabindex="5">\n    <option value="1">One</option>\n    <option value="8">Eight</option>\n    <option value="43">Fourty Three</option>\n    <option value="90">Ninety</option>\n    <option value="180">One Hundred and Eighty</option>\n</select>');
        element.append(selectRoot);
        $compile(element)($scope);
        $scope.$apply();

        selectRoot = element.children();

        // Select should retain name for form submission purposes
        expect(selectRoot.find('select').attr('name')).toEqual('testing_select');
        // Tab index should be constant
        expect(selectRoot.attr('tabindex')).toEqual('5');

        expect(selectRoot.hasClass('cb-select')).toBe(true);
        expect(selectRoot[0].nodeName.toLowerCase()).not.toEqual('select');

        expect(selectRoot.scope().select.selectedItem.value).toEqual('1');
        expect(selectRoot.find('option[selected=selected]').val()).toEqual('1');
    });

    it('should replace a deeply nested child select', function() {
        selectRoot = angular.element('<div class="cb-select-replace">\n    <div class="random-child">\n        <label>Some Select</label>\n        <select name="testing_select" tabindex="5">\n            <option value="1">One</option>\n            <option value="8">Eight</option>\n            <option value="43">Fourty Three</option>\n            <option value="90">Ninety</option>\n            <option value="180">One Hundred and Eighty</option>\n        </select>\n    </div>\n    </div>\n</div>\n');
        element.append(selectRoot);
        $compile(element)($scope);
        $scope.$apply();

        selectRoot = element.children();

        expect(selectRoot.hasClass('cb-select')).toEqual(false);
        expect(selectRoot.find('.cb-select').scope().select.selectedItem.value).toEqual('1');
        expect(selectRoot.find('option[selected=selected]').val()).toEqual('1');
    });

    it('should retain the selected option', function() {
        selectRoot = angular.element('<select class="cb-select-replace" name="testing_select" tabindex="5">\n    <option value="1">One</option>\n    <option value="8">Eight</option>\n    <option value="43">Fourty Three</option>\n    <option value="90" selected="selected">Ninety</option>\n    <option value="180">One Hundred and Eighty</option>\n</select>');
        element.append(selectRoot);
        $compile(element)($scope);
        $scope.$apply();

        selectRoot = element.children();

        expect(selectRoot.scope().select.selectedItem.value).toEqual('90');
        expect(selectRoot.find('option[selected=selected]').val()).toEqual('90');
    });

    it('should select corresponding option when a .cb-select-option is clicked', function() {
        selectRoot = angular.element('<select class="cb-select-replace" name="testing_select" tabindex="5">\n    <option value="1">One</option>\n    <option value="8">Eight</option>\n    <option value="43">Fourty Three</option>\n    <option value="90" selected="selected">Ninety</option>\n    <option value="180">One Hundred and Eighty</option>\n</select>');
        element.append(selectRoot);
        $compile(element)($scope);
        $scope.$apply();

        selectRoot = element.children();

        selectRoot.find('.cb-select-option').eq(2).trigger('mousedown');
        expect(selectRoot.scope().select.selectedItem.value).toEqual('43');
        expect(selectRoot.find('option[selected=selected]').val()).toEqual('43');
    });

    it('should be accessible with keyboard', function() {
        selectRoot = angular.element('<select class="cb-select-replace" name="testing_select" tabindex="5">\n    <option value="1">One</option>\n    <option value="8">Eight</option>\n    <option value="43">Fourty Three</option>\n    <option value="90" selected="selected">Ninety</option>\n    <option value="180">One Hundred and Eighty</option>\n</select>');
        element.append(selectRoot);
        $compile(element)($scope);
        $scope.$apply();

        selectRoot = element.children();

        var arrowDown = jQuery.Event('keydown', {which: 40, keyCode: 40}),
            arrowUp = jQuery.Event('keydown', {which: 38, keyCode: 38}),
            enter = jQuery.Event('keydown', {which: 13, keyCode: 13}),
            scope = selectRoot.scope();


        expect(scope.select.show).toBe(false);
        selectRoot.trigger(enter);
        expect(scope.select.show).toBe(true);

        expect(scope.select.selectedItem.value).toEqual('90');
        selectRoot.trigger(arrowDown);
        expect(scope.select.selectedItem.value).toEqual('180');
        selectRoot.trigger(arrowUp).trigger(arrowUp);
        expect(scope.select.selectedItem.value).toEqual('43');
        selectRoot.trigger(arrowUp).trigger(arrowUp);
        expect(scope.select.selectedItem.value).toEqual('1');
        selectRoot.trigger(arrowUp);
        expect(scope.select.selectedItem.value).toEqual('1');
    });

});
