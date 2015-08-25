'use strict';

var proxyquire = require('proxyquire');
var sinon      = require('sinon');

describe('index', function () {
    var pingPongNickname;
    var PingPongNickname;
    var sandbox;
    var stubs;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        stubs = {
            request: {
                get: sandbox.stub()
            }
        };

        PingPongNickname = proxyquire('..', stubs);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('new', function () {
        describe('with required options missing', function () {
            describe('missing host', function () {
                it('throws an error', function () {
                    expect(function () {
                        new PingPongNickname();
                    }).toThrow('PingPongNickname must be initialized with a host');
                });
            });
        });

        describe('with required options', function () {
            beforeEach(function () {
                pingPongNickname = new PingPongNickname({
                    host: 'yourhost.com'
                });
            });

            it('returns an object', function () {
                expect(pingPongNickname).toBeDefined();
                expect(typeof(pingPongNickname)).toEqual('object');
            });

            it('initialises the object with the default options', function () {
                expect(pingPongNickname.protocol).toBeDefined();
                expect(pingPongNickname.protocol).toEqual('https');
            });

            it('sets the appropriate host based off of options passed', function () {
                expect(pingPongNickname.host).toBeDefined();
                expect(pingPongNickname.host).toEqual('yourhost.com');
            });
        });

        describe('with custom options', function () {
            beforeEach(function () {
                pingPongNickname = new PingPongNickname({
                    host: 'yourhost.com',
                    port: 3000,
                    protocol: 'http'
                });
            });

            it('returns an object', function () {
                expect(pingPongNickname).toBeDefined();
                expect(typeof(pingPongNickname)).toEqual('object');
            });

            it('sets the appropriate host based off of options passed', function () {
                expect(pingPongNickname.host).toBeDefined();
                expect(pingPongNickname.host).toEqual('yourhost.com');
            });

            it('sets the appropriate port based off of options passed', function () {
                expect(pingPongNickname.port).toBeDefined();
                expect(pingPongNickname.port).toEqual(3000);
            });

            it('sets the appropriate protocol based off of options passed', function () {
                expect(pingPongNickname.protocol).toBeDefined();
                expect(pingPongNickname.protocol).toEqual('http');
            });
        });


        describe('instance methods', function () {
            it('creates get', function () {
                expect(pingPongNickname.get).toBeDefined();
            });

            it('has api methods', function () {
                expect(pingPongNickname.nickname).toBeDefined();
            });
        });
    });

    describe('request methods', function () {
        describe('get method', function () {
            beforeEach(function () {
                pingPongNickname = new PingPongNickname({
                    host: 'yourhost.com'
                });
            });

            describe('get', function () {
                var getStub;

                describe('arguments', function () {
                    beforeEach(function () {
                        getStub = sandbox.stub(pingPongNickname, 'get');

                        pingPongNickname.get('/nickname', {}, function () {});
                    });

                    it('gets passed the correct arguments', function () {
                        expect(getStub.called).toEqual(true);
                        expect(getStub.args[0][0]).toEqual('/nickname');
                        expect(getStub.args[0][1]).toEqual({});
                        expect(typeof(getStub.args[0][2])).toEqual('function');
                    });
                });

                describe('request call', function () {
                    describe('with options', function () {
                        beforeEach(function () {
                            pingPongNickname.get('/nickname', {}, function () {});
                        });

                        it('gets passed the correct options', function () {
                            expect(stubs.request.get.args[0][0].uri).
                                toEqual('https://yourhost.com/nickname');
                        });

                        it('gets passed a callback function', function () {
                            expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                        });
                    });

                    describe('without no options', function () {
                        beforeEach(function () {
                            pingPongNickname.get('/nickname', function () {});
                        });

                        it('gets passed the correct options', function () {
                            expect(stubs.request.get.args[0][0].uri).
                                toEqual('https://yourhost.com/nickname');
                        });

                        it('gets passed a callback function', function () {
                            expect(typeof(stubs.request.get.args[0][1])).toEqual('function');
                        });
                    });
                });

                describe('callback', function () {
                    var callbackSpy;

                    beforeEach(function () {
                        callbackSpy = sandbox.spy();
                    });

                    describe('error', function () {
                        beforeEach(function () {
                            stubs = {
                                request: {
                                    get: sandbox.stub().yields('Fake Error', {}, {})
                                }
                            };

                            PingPongNickname = proxyquire('..', stubs);

                            pingPongNickname = new PingPongNickname({
                                host: 'yourhost.com'
                            });
                        });

                        it('calls callback with error if error returned', function () {
                            pingPongNickname.get('/nickname', {}, callbackSpy);
                            expect(callbackSpy.calledOnce).toEqual(true);
                            expect(callbackSpy.calledWith('Fake Error')).toEqual(true);
                        });
                    });

                    describe('no error', function () {
                        beforeEach(function () {
                            stubs = {
                                request: {
                                    get: sandbox.stub().yields(null, {
                                        nickname: 'Kiss of the Killer'
                                    })
                                }
                            };

                            PingPongNickname = proxyquire('..', stubs);

                            pingPongNickname = new PingPongNickname({
                                host: 'yourhost.com'
                            });
                        });

                        it('calls callback with results if no error returned', function () {
                            pingPongNickname.get('/nickname', {}, callbackSpy);

                            expect(callbackSpy.calledOnce).toEqual(true);
                            expect(callbackSpy.calledWith(null, {
                                nickname: 'Kiss of the Killer'
                            })).toEqual(true);
                        });
                    });
                });
            });
        });
    });

    describe('nickname', function () {
        var getStub,
            nicknameSpy;

        beforeEach(function () {
            pingPongNickname = new PingPongNickname({
                host: 'yourhost.com'
            });

            getStub = sandbox.stub(pingPongNickname, 'get');
            nicknameSpy = sandbox.spy(pingPongNickname, 'nickname');
        });

        describe('with no options', function () {
            beforeEach(function () {
                pingPongNickname.nickname(function () {});
            });

            it('it calls player and passes the correct arguments', function () {
                expect(nicknameSpy.calledOnce).toEqual(true);
                expect(typeof(nicknameSpy.args[0][0])).toEqual('function');
            });

            it('it calls get and passes the correct arguments', function () {
                expect(getStub.calledOnce).toEqual(true);
                expect(getStub.args[0][0]).toEqual('/nickname');
                expect(typeof(getStub.args[0][1])).toEqual('function');
            });
        });
    });
});
