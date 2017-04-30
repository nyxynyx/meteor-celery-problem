import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Estimates = new Mongo.Collection('estimates');

if (Meteor.isServer) {
	Meteor.publish('estimates', () => {
		return Estimates.find()
	});
}

export default Estimates;


if (Meteor.isServer) {

	Meteor.methods({
		'estimates.request'() {
			console.log('estimates.request called');
			
			// Create Celery client
			var celery = require('node-celery')
			var client = celery.createClient({
				CELERY_BROKER_URL: 'amqp://192.168.1.26:5672//',
				CELERY_RESULT_BACKEND: 'amqp'
			});

			// Queue task on connect
			client.on('connect', function() {
				console.log('connected');
				start_latitude = 1.3053947
				start_longitude = 103.8273045
				client.call('proj.tasks.getPriceEstimates', [start_latitude, start_longitude],
					function(result) {
						console.log('result: ', result);
						client.end();
					})
			});
		}
	});

}