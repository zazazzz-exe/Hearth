#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env};

use super::{MalunggayPandesal, MalunggayPandesalClient};

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, MalunggayPandesal);
    let client = MalunggayPandesalClient::new(&env, &contract_id);

    let owner = Address::generate(&env);

    client.initialize(&owner);

    assert_eq!(client.get_owner(), owner);
    assert_eq!(client.get_total(), 0);
}

#[test]
fn test_contribute() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, MalunggayPandesal);
    let client = MalunggayPandesalClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&owner);

    client.contribute(&user, &100);

    assert_eq!(client.get_total(), 100);
    assert_eq!(client.get_contribution(&user), 100);
}

#[test]
fn test_bake() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, MalunggayPandesal);
    let client = MalunggayPandesalClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&owner);

    client.contribute(&user, &200);

    client.bake(&50);

    assert_eq!(client.get_total(), 150);
}

#[test]
fn test_multi_user_multi_bake_flow() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, MalunggayPandesal);
    let client = MalunggayPandesalClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let user_a = Address::generate(&env);
    let user_b = Address::generate(&env);

    client.initialize(&owner);

    client.contribute(&user_a, &150);
    client.contribute(&user_b, &250);
    client.contribute(&user_a, &50);

    assert_eq!(client.get_contribution(&user_a), 200);
    assert_eq!(client.get_contribution(&user_b), 250);
    assert_eq!(client.get_total(), 450);

    client.bake(&125);
    client.bake(&75);

    assert_eq!(client.get_total(), 250);
}

#[test]
#[should_panic(expected = "Not enough ingredients")]
fn test_bake_more_than_total_panics() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, MalunggayPandesal);
    let client = MalunggayPandesalClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&owner);
    client.contribute(&user, &100);

    client.bake(&200);
}