#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env,
};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Owner,
    TotalSupply,      // total pandesal produced
    Contributions(Address), // how much each user contributed
}

#[contract]
pub struct MalunggayPandesal;

#[contractimpl]
impl MalunggayPandesal {
    // Initialize contract
    pub fn initialize(env: Env, owner: Address) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("Already initialized");
        }

        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::TotalSupply, &0_i128);
    }

    // Contribute ingredients / funds
    pub fn contribute(env: Env, user: Address, amount: i128) {
        user.require_auth();

        let mut total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);

        total += amount;

        env.storage().instance().set(&DataKey::TotalSupply, &total);

        let key = DataKey::Contributions(user.clone());

        let mut user_total: i128 = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or(0);

        user_total += amount;

        env.storage().instance().set(&key, &user_total);
    }

    // Bake pandesal (reduce supply)
    pub fn bake(env: Env, amount: i128) {
        let owner: Address = env
            .storage()
            .instance()
            .get(&DataKey::Owner)
            .unwrap();

        owner.require_auth();

        let mut total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0);

        if amount > total {
            panic!("Not enough ingredients");
        }

        total -= amount;

        env.storage().instance().set(&DataKey::TotalSupply, &total);
    }

    // View total supply
    pub fn get_total(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0)
    }

    // View user contribution
    pub fn get_contribution(env: Env, user: Address) -> i128 {
        let key = DataKey::Contributions(user);

        env.storage()
            .instance()
            .get(&key)
            .unwrap_or(0)
    }

    // Get owner
    pub fn get_owner(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Owner)
            .unwrap()
    }
}

#[cfg(test)]
mod test;