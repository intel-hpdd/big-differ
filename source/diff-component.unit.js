import 'angular-mocks';
import bigDifferModule from './big-differ-module';

describe('diff component', () => {
  beforeEach(module(bigDifferModule));

  var $scope, diffComponent, diffContainerCtrl, subscriber;

  beforeEach(inject(function ($rootScope, $componentController) {
    $scope = $rootScope.$new();

    subscriber = jasmine.createSpy('subscriber');

    diffContainerCtrl = {
      register: jasmine.createSpy('register'),
      deregister: jasmine.createSpy('deregister')
    };

    diffComponent = $componentController('differ',
      {$scope},
      {diffContainerCtrl}
    );

    diffComponent.$onInit();
    diffComponent.subscribe(subscriber);
  }));

  it('should register with diffContainerCtrl', () => {
    expect(diffContainerCtrl.register)
      .toHaveBeenCalledOnceWith(jasmine.any(Object));
  });

  it('should deregister with diffContainerCtrl on destroy', () => {
    $scope.$destroy();

    expect(diffContainerCtrl.deregister)
      .toHaveBeenCalledOnceWith(jasmine.any(Object));
  });

  it('should have a state getter', () => {
    diffComponent.remoteChange('x');

    expect(diffComponent.getState()).toEqual({
      status: 'clean',
      initial: 'x',
      local: 'x',
      remote: 'x'
    });
  });

  it('should emit on a remote change', () => {
    diffComponent.remoteChange('x');

    expect(subscriber).toHaveBeenCalledOnceWith({
      status: 'clean',
      initial: 'x',
      local: 'x',
      remote: 'x'
    });
  });

  it('should update on a second remote change', () => {
    diffComponent.remoteChange('x');
    diffComponent.remoteChange('y');

    expect(subscriber).toHaveBeenCalledOnceWith({
      status: 'remote',
      initial: 'x',
      local: 'x',
      remote: 'y'
    });
  });

  it('should update on a local change', () => {
    diffComponent.remoteChange('x');
    diffComponent.localChange('y');

    expect(subscriber).toHaveBeenCalledOnceWith({
      status: 'local',
      initial: 'x',
      local: 'y',
      remote: 'x'
    });
  });

  it('should reflect a conflict', () => {
    diffComponent.remoteChange('x');
    diffComponent.localChange('y');
    diffComponent.remoteChange('z');

    expect(subscriber).toHaveBeenCalledOnceWith({
      status: 'conflict',
      initial: 'x',
      local: 'y',
      remote: 'z'
    });
  });

  it('should implicitly reset if local and remote are the same', () => {
    diffComponent.remoteChange('x');
    diffComponent.localChange('y');
    diffComponent.remoteChange('y');

    expect(subscriber).toHaveBeenCalledOnceWith({
      status: 'clean',
      initial: 'y',
      local: 'y',
      remote: 'y'
    });
  });

  it('should reset to clean', () => {
    diffComponent.remoteChange('x');
    diffComponent.localChange('y');
    diffComponent.reset();

    expect(subscriber).toHaveBeenCalledTwiceWith({
      status: 'clean',
      initial: 'x',
      local: 'x',
      remote: 'x'
    });
  });
});
