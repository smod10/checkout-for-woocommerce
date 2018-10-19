class Account {
	constructor(username, email, password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}
}

class AccountFactory {}

AccountFactory.create = (account) => {
	return new Account(account.username, account.email, account.password);
};

AccountFactory.createAll = (accounts) => {
	return accounts.map(account => AccountFactory.create(account));
};

module.exports = {
	Account,
	AccountFactory
};