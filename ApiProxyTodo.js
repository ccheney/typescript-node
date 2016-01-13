import EventDispatcher from 'structurejs/event/EventDispatcher';
import Collection from 'structurejs/model/Collection';
import EndPoint from '../constants/EndPoint';
import ApiProxyEvent from '../events/ApiProxyEvent';
import TodoVO from '../models/TodoVO';

/**
 * TODO: YUIDoc_comment
 *
 * @class ApiProxyTodo
 * @constructor
 **/
class ApiProxyTodo extends EventDispatcher {

    static _instance:ApiProxyTodo = new ApiProxyTodo();

    _todoAPI = null;

    constructor() {
        if(ApiProxyTodo._instance){
            throw new Error('Error: Instantiation failed: Use ApiProxyTodo.getInstance() instead of new.');
        }
        super();
        ApiProxyTodo._instance = this;

        this._todoAPI = new Firebase('https://codebelt.firebaseio.com/todo');
    }

    static getInstance():ApiProxyTodo {
        return ApiProxyTodo._instance;
    }

    /**
     * @overridden BaseModal.enable
     */
    enable() {
        if (this.isEnabled === true) { return this; }

        this._todoAPI.on('value', this._onTodoChange, this);

        return super.enable();
    }

    /**
     * @overridden BaseModal.disable
     */
    disable() {
        if (this.isEnabled === false) { return this; }

        this._todoAPI.off('value', this._onTodoChange, this);

        return super.disable();
    }

    save(todoVO:TodoVO):void {
        let record = this._todoAPI.child(todoVO.id);

        record.set(todoVO.toJSON(), (error) => this._onComplete(error));
    }

    delete(todoVO:TodoVO):void {
        let record = this._todoAPI.child(todoVO.id);

        record.remove((error) => this._onComplete(error));
    }

    _onTodoChange(snapshot) {
        let data = snapshot.val();

        let collection = new Collection(TodoVO);

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                collection.add(data[key]);
            }
        }

        this.dispatchEvent(new ApiProxyEvent(ApiProxyEvent.CHANGED, false, false, collection));
    }

    _onComplete(error):void {
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
    }

}

export default ApiProxyTodo;
