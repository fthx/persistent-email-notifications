/* 
	Persistent Email Notifications
	Copyright Francois Thirioux 2021
	Contributors: @fthx
	License GPL v3
*/


const Main = imports.ui.main;
const MessageTray = Main.messageTray;
const Urgency = imports.ui.messageTray.Urgency;

var EMAIL_APP_NAMES = [ "Thunderbird", "Evolution", "Mailspring", "Geary", "TypeApp" ];


class Extension {
    constructor() {
    }
    
    _on_source_added(tray, source) {
    	this.new_source = source;
 		this.source_is_email_app = false;
 		EMAIL_APP_NAMES.forEach(email_app_name => {
 			this.source_is_email_app = this.source_is_email_app || this.new_source.title.includes(email_app_name);
 		});
        if (this.source_is_email_app) {
        	this.notification_added = this.new_source.connect('notification-added', this._on_notification_added.bind(this));
        }
    }
    
    _on_notification_added(tray, notification) {
    	notification.setUrgency(Urgency.CRITICAL);
    	this.new_source.disconnect(this.notification_added);
    }
    
    enable() {
		this.source_added = MessageTray.connect('source-added', this._on_source_added.bind(this));
    }

    disable() {
    	MessageTray.disconnect(this.source_added);
    }
}

function init() {
	return new Extension();
}

