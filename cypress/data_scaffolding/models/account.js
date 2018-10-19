class Account {
	constructor(username, email, password, badPassword = "fashjfakjs") {
		this.username = username;
		this.email = email;
		this.password = password;
		this.badPassword = badPassword;
	}
}

class AccountFactory {}

AccountFactory.create = (account) => {
	return new Account(account.username, account.email, account.password, account.badPassword);
};

AccountFactory.createAll = (accounts) => {
	return accounts.map(account => AccountFactory.create(account));
};

module.exports = {
	Account,
	AccountFactory
};