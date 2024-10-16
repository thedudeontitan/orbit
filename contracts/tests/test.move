module prediction_market::PredictionMarketTest {

    use aptos_framework::coin::{Coin, CoinStore};
    use std::signer;
    use std::vector;
    use 0x<your_address>::PredictionMarket;

    fun initialize_test_users() {
        // Initialize test accounts with balances
        let creator = @0x1;
        let user1 = @0x2;
        let user2 = @0x3;

        CoinStore::mint<Coin>(creator, 1000000);
        CoinStore::mint<Coin>(user1, 500000);
        CoinStore::mint<Coin>(user2, 500000);

        PredictionMarket::initialize(&signer::create_signer(creator));
        PredictionMarket::initialize(&signer::create_signer(user1));
        PredictionMarket::initialize(&signer::create_signer(user2));
    }

    #[test]
    fun test_create_market() {
        let creator = signer::create_signer(@0x1);
        PredictionMarket::create_market(&creator, b"Will it rain tomorrow?");
        let market_counter = borrow_global<PredictionMarket::MarketCounter>(@0x1);

        assert!(vector::length(&market_counter.markets) == 1, 100);
        let market = vector::borrow(&market_counter.markets, 0);
        assert!(market.market_id == 0, 101);
        assert!(market.total_yes == 0, 102);
        assert!(market.total_no == 0, 103);
        assert!(market.creator == @0x1, 104);
        assert!(!market.resolved, 105);
    }

    #[test]
    fun test_place_bet_yes() {
        initialize_test_users();
        let user1 = signer::create_signer(@0x2);
        let market_id = 0;
        let bet_amount = 1000;

        PredictionMarket::place_bet(&user1, market_id, PredictionMarket::YES, bet_amount);

        let market_counter = borrow_global<PredictionMarket::MarketCounter>(@0x1);
        let market = vector::borrow(&market_counter.markets, market_id);

        assert!(market.total_yes == bet_amount, 200);
        assert!(CoinStore::balance<Coin>(@0x2) == 500000 - bet_amount, 201);

        let user_bets = borrow_global<PredictionMarket::UserBets>(@0x2);
        assert!(vector::length(&user_bets.bets) == 1, 202);
        let bet = vector::borrow(&user_bets.bets, 0);
        assert!(bet.outcome == PredictionMarket::YES, 203);
        assert!(bet.amount == bet_amount, 204);
    }

    #[test]
    fun test_place_bet_no() {
        initialize_test_users();
        let user2 = signer::create_signer(@0x3);
        let market_id = 0;
        let bet_amount = 1500;

        PredictionMarket::place_bet(&user2, market_id, PredictionMarket::NO, bet_amount);

        let market_counter = borrow_global<PredictionMarket::MarketCounter>(@0x1);
        let market = vector::borrow(&market_counter.markets, market_id);

        assert!(market.total_no == bet_amount, 300);
        assert!(CoinStore::balance<Coin>(@0x3) == 500000 - bet_amount, 301);

        let user_bets = borrow_global<PredictionMarket::UserBets>(@0x3);
        assert!(vector::length(&user_bets.bets) == 1, 302);
        let bet = vector::borrow(&user_bets.bets, 0);
        assert!(bet.outcome == PredictionMarket::NO, 303);
        assert!(bet.amount == bet_amount, 304);
    }

    #[test]
    fun test_resolve_market_yes() {
        initialize_test_users();
        let creator = signer::create_signer(@0x1);
        let market_id = 0;

        PredictionMarket::resolve_market(&creator, market_id, PredictionMarket::YES);

        let market_counter = borrow_global<PredictionMarket::MarketCounter>(@0x1);
        let market = vector::borrow(&market_counter.markets, market_id);

        assert!(market.outcome == PredictionMarket::YES, 400);
        assert!(market.resolved, 401);
    }

    #[test]
    fun test_claim_winnings_yes_bettor() {
        initialize_test_users();
        let user1 = signer::create_signer(@0x2);
        let market_id = 0;

        PredictionMarket::claim_winnings(&user1, market_id);

        let market_counter = borrow_global<PredictionMarket::MarketCounter>(@0x1);
        let market = vector::borrow(&market_counter.markets, market_id);

        let user_bets = exists<PredictionMarket::UserBets>(@0x2);
        assert!(!user_bets, 500); // All bets should be removed after claiming
    }

    #[test]
    fun test_claim_winnings_no_bettor() {
        initialize_test_users();
        let user2 = signer::create_signer(@0x3);
        let market_id = 0;

        PredictionMarket::claim_winnings(&user2, market_id);

        let user_bets = exists<PredictionMarket::UserBets>(@0x3);
        assert!(!user_bets, 600); // All bets should be removed after claiming
    }
}
