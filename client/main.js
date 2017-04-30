Meteor.startup(() => {
	Meteor.call('estimates.request', function(err) {
		console.log('ok')
	})
});