//MODELS - SERVER SIDE

var mongoose = require('mongoose'), 
Schema = mongoose.Schema;


var UserSchema = Schema({

	name: String,
	created_at: {type: Date, default: Date.now}

})

var TopicSchema = Schema({

	topic: String,
	description: String,
	user_id: String,
	user_name: String,
	post: [{type: Schema.ObjectId, ref: 'Post'}],
	created_at: {type: Date, default: Date.now} 	

})

TopicSchema.path('topic').required(true, 'question is required');


var PostSchema = Schema({

	_topic: {type: Schema.ObjectId, ref: 'Topic'},
	post: String,
	support: String,
	user_id: String,
	user_name: String,
	created_at: {type: Date, default: Date.now},
	like: {type: Number, default: 0 },
	dislike: {type: Number, default: 0} 	

})

PostSchema.path('post').required(true, 'answer is required');

mongoose.model('User', UserSchema);
mongoose.model('Topic', TopicSchema);
mongoose.model('Post', PostSchema);

PostSchema.pre('remove', function(next){
    this.model('Topic').update(
        {post: {$in: this._id}}, 
        {$pull: {post: this._id}}, 
        {multi: true},
        next
    );
});
