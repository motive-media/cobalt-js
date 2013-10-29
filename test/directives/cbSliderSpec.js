'use strict';

describe('cbSlider', function() {
    beforeEach(module('cbSlider'));

    var element, $scope, $compile, sliderElem;

    beforeEach(inject(function(_$compile_, $rootScope) {
        $scope = $rootScope.$new();
        $compile = _$compile_;
        element = $compile('<div></div>')($scope);

        $scope.objects = ['This','is','an','array'];
    }));

    it('should bind ng-model content to slider[collectionName]', function() {
        // Check default value of 'pages'
        element.html(sliderElem = $compile('<div cb-slider ng-model="objects"></div>')($scope));
        $scope.$apply();
        expect(sliderElem.scope().slider.pages).toBe($scope.objects);

        // Check custom value of 'items'
        element.html(sliderElem = $compile('<div cb-slider="{collectionName: \'items\'}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        expect(sliderElem.scope().slider.items).toBe($scope.objects);
    });

    it('should group into sub-arrays when slider.perPage != 1', function() {
        var pages;

        element.html(sliderElem = $compile('<div cb-slider="{perPage: 2}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        pages = sliderElem.scope().slider.pages;
        expect(pages.length).toBe(2);
        expect(pages[0]).toEqual($scope.objects.slice(0,2));
        expect(pages[1]).toEqual($scope.objects.slice(2,4));

        element.html(sliderElem = $compile('<div cb-slider="{perPage: 3}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        pages = sliderElem.scope().slider.pages;
        expect(pages.length).toBe(2);
        expect(pages[0]).toEqual($scope.objects.slice(0,3));
        expect(pages[1]).toEqual($scope.objects.slice(3,4));

        element.html(sliderElem = $compile('<div cb-slider="{perPage: 4}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        pages = sliderElem.scope().slider.pages;
        expect(pages.length).toBe(1);
        expect(pages[0]).toEqual($scope.objects);
        expect(pages[1]).toBeUndefined();
    });

    it('should limit currentPage to a meaningful value', function() {
        var slider;

        element.html(sliderElem = $compile('<div cb-slider="{perPage: 2}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        slider = sliderElem.scope().slider;
        expect(slider.currentPage).toBe(0);
        slider.prev();
        expect(slider.currentPage).toBe(0);
        slider.goto(3);
        expect(slider.currentPage).toBe(0);
        slider.next();
        expect(slider.currentPage).toBe(1);
        slider.next();
        expect(slider.currentPage).toBe(1);

        element.html(sliderElem = $compile('<div cb-slider ng-model="objects"></div>')($scope));
        $scope.$apply();
        slider = sliderElem.scope().slider;
        expect(slider.currentPage).toBe(0);
        slider.prev();
        expect(slider.currentPage).toBe(0);
        slider.goto(3);
        expect(slider.currentPage).toBe(3);
        slider.next();
        expect(slider.currentPage).toBe(3);
        slider.prev();
        expect(slider.currentPage).toBe(2);

        element.html(sliderElem = $compile('<div cb-slider="{defaultPage: 9001}" ng-model="objects"></div>')($scope));
        $scope.$apply();
        slider = sliderElem.scope().slider;
        expect(slider.currentPage).toBe(3);
    });
});
