import {DiffModelCtrl} from './diff-model';

describe('diff model', () => {
  var diffModelCtrl;

  beforeEach(() => {
    diffModelCtrl = new DiffModelCtrl();
    diffModelCtrl.modelCtrl = {
      $formatters: [],
      $viewChangeListeners: [],
      $viewValue: '',
      $setViewValue: jasmine.createSpy('$setViewValue'),
      $render: jasmine.createSpy('$render')
    };

    diffModelCtrl.diffCtrl = {
      remoteChange: jasmine.createSpy('remoteChange'),
      localChange: jasmine.createSpy('localChange'),
      subscribe: jasmine.createSpy('subscribe')
    };

    diffModelCtrl.$onInit();
  });

  it('should push a formatter', () => {
    expect(diffModelCtrl.modelCtrl.$formatters).toEqual([
      diffModelCtrl.diffCtrl.remoteChange
    ]);
  });

  it('should push a view change listener', () => {
    expect(diffModelCtrl.modelCtrl.$viewChangeListeners).toEqual([
      jasmine.any(Function)
    ]);
  });

  it('should send a local change when view changes', () => {
    const fn = diffModelCtrl.modelCtrl.$viewChangeListeners[0];
    fn();

    expect(diffModelCtrl.diffCtrl.localChange)
      .toHaveBeenCalledOnceWith('');
  });

  it('should subscribe to diffCtrl', () => {
    expect(diffModelCtrl.diffCtrl.subscribe).toHaveBeenCalledOnceWith(
      jasmine.any(Function)
    );
  });

  describe('subscribing', () => {
    var fn;

    beforeEach(() => {
      fn = diffModelCtrl.diffCtrl.subscribe.calls.mostRecent().args[0];
    });

    it('should set view value with new local', () => {
      fn({
        local: 'foo'
      });

      expect(diffModelCtrl.modelCtrl.$setViewValue).toHaveBeenCalledOnceWith('foo');
    });

    it('should call $render', () => {
      fn({
        local: 'foo'
      });

      expect(diffModelCtrl.modelCtrl.$render).toHaveBeenCalledOnce();
    });

    it('should return early if local is null', () => {
      fn({
        local: null
      });

      expect(diffModelCtrl.modelCtrl.$render).not.toHaveBeenCalled();
    });

    it('should return early if local === $viewValue', () => {
      fn({
        local: ''
      });

      expect(diffModelCtrl.modelCtrl.$render).not.toHaveBeenCalled();
    });
  });

});
