import Env from '@ioc:Adonis/Core/Env'
import { BaseTask } from 'adonis5-scheduler/build'
import { TwitterApi } from 'twitter-api-v2'
import Referee from 'App/Models/Referee'

export default class GetReferee extends BaseTask {
	public static get schedule() {
		return '*/10 * * * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		console.log('handle')
		const clientV2 = new TwitterApi(Env.get('TWITTER_BEARER_TOKEN'))
		// const today_date = new Date().toLocaleDateString();
		// const start_time = new Date(today_date).toISOString();
		// const minFriends = 2;
		let data;
		const referees = await Referee.query().where('isTweeted', false).andWhere('isRewarded', false).whereNotNull('accountId').whereNot('accountId', '');
		let user;
		//data = await clientV2.v2.search(`conversation_id:${tweetUrl}`, {"tweet.fields" : "author_id", "max_results" : "100"});
		await referees.forEach(async (referee) => {
			user = await clientV2.v2.userByUsername(referee.$attributes.accountId);
			// data = await clientV2.v2.userTimeline(user.data.id, {start_time: start_time});
			data = await clientV2.v2.userTimeline(user.data.id, {exclude: ['retweets'], "tweet.fields" : "entities"});
			const result = await this.checkingTwitter(data);
			if(result){
				await Referee.query().where("accountId", referee.$attributes.accountId).update({'isTweeted': true});
			}
		})
  	}

	public async checkingTwitter(data) {
		for await (const tweetData of data) {
			// let userlist = tweetData.text.match(/@\w+/g);
			// console.log(userlist)
			// let count = 0;
			// let userInfo;
			// if(userlist)
			// 	if(userlist.length >= minFriends){
			// 		for(let i=0; i< userlist.length; i ++){
			// 			userInfo = await clientV2.v2.userByUsername(userlist[1].substr(1));
			// 			if(userInfo.data != undefined){
			// 				count ++;
			// 			}
			// 		}
			// 		if(count >= minFriends){
			// 			await Referee.query().where("accountId", referee.$attributes.account_id).update({'isTweeted': true});
			// 		}
			// 		console.log('-------------:> ', count);
			// 	};
			if(tweetData.entities){
				if(tweetData.entities.urls){
					for (const url of tweetData.entities.urls) {
						if(url.expanded_url.includes('http://game.cryptorunner.io'))
							return true;
					}
				}
			}
		}
		return false;
	}
}