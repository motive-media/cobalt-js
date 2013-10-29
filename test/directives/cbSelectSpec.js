'use strict';

describe("cbSelect", function() {
    beforeEach(module('cbSelect'));

    var element, $compile, $scope;

    beforeEach(inject(function(_$compile_, $rootScope){
        $compile = _$compile_;
        $scope = $rootScope.$new();
        element = $compile('<div></div>')($rootScope);

        $scope.objects = [
            {'label': 'One', 'value': 1},
            {'label': 'Two', 'value': 2},
            {'label': 'Six', 'value': 6},
            {'label': 'Eleven', 'value': 11}
        ];

        element.append($compile('<div cb-select options="objects" ng-model="selectedObject"></div>')($scope));

        $scope.$apply();
    }));

    it("should create an option for each item in the array", function() {
        expect(element.find('option').length).toBe(4);
        expect(element.find('.cb-select-option').length).toBe(4);
    });

    it("should fill ng-model with the selected object", function() {
        expect($scope.selectedObject).toBeFalsy();

        element.find('.cb-select-option').get(1).click();
        expect($scope.selectedObject).toBe($scope.objects[1]);

        element.find('.cb-select-option').get(3).click();
        expect($scope.selectedObject).toBe($scope.objects[3]);
    });

    it("should be accessible with keyboard", function() {
        var arrowDown = jQuery.Event("keydown", {which: 40, keyCode: 40}),
            arrowUp = jQuery.Event("keydown", {which: 38, keyCode: 38}),
            select = element.find('.cb-select');

        $scope.$apply();

        select.trigger(arrowDown);
        expect($scope.selectedObject).toBe($scope.objects[0]);
        select.trigger(arrowDown);
        expect($scope.selectedObject).toBe($scope.objects[1]);
        select.trigger(arrowUp);
        expect($scope.selectedObject).toBe($scope.objects[0]);
    });
});