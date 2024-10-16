module prediction_market::prediction_market {
    use std::signer;
    use std::string::String;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    // Error codes
    const ERR_MARKET_ALREADY_EXISTS: u64 = 1;
    const ERR_MARKET_NOT_FOUND: u64 = 2;
    const ERR_INSUFFICIENT_BALANCE: u64 = 3;
    const ERR_MARKET_ALREADY_RESOLVED: u64 = 4;
    const ERR_MARKET_NOT_RESOLVED: u64 = 5;
    const ERR_UNAUTHORIZED: u64 = 6;

    struct Market has store {
        creator: address,
        question: String,
        end_time: u64,
        total_yes_amount: u64,
        total_no_amount: u64,
        resolved: bool,
        outcome: bool,
    }

    struct UserBet has store {
        yes_amount: u64,
        no_amount: u64,
    }

    struct PredictionMarketState<phantom CoinType> has key {
        markets: Table<String, Market>,
        user_bets: Table<address, Table<String, UserBet>>,
        treasury: Coin<CoinType>,
    }

    fun init_module<CoinType>(account: &signer) {
        move_to(account, PredictionMarketState<CoinType> {
            markets: table::new(),
            user_bets: table::new(),
            treasury: coin::zero<CoinType>(),
        });
    }

    public entry fun create_market<CoinType>(
        creator: &signer,
        question: String,
        end_time: u64,
    ) acquires PredictionMarketState {
        let creator_addr = signer::address_of(creator);
        let state = borrow_global_mut<PredictionMarketState<CoinType>>(@prediction_market);

        assert!(!table::contains(&state.markets, question), ERR_MARKET_ALREADY_EXISTS);

        let market = Market {
            creator: creator_addr,
            question,
            end_time,
            total_yes_amount: 0,
            total_no_amount: 0,
            resolved: false,
            outcome: false,
        };

        table::add(&mut state.markets, question, market);
    }

    public entry fun place_bet<CoinType>(
        bettor: &signer,
        question: String,
        is_yes: bool,
        amount: u64,
    ) acquires PredictionMarketState {
        let bettor_addr = signer::address_of(bettor);
        let state = borrow_global_mut<PredictionMarketState<CoinType>>(@prediction_market);

        assert!(table::contains(&state.markets, question), ERR_MARKET_NOT_FOUND);
        let market = table::borrow_mut(&mut state.markets, question);
        assert!(!market.resolved, ERR_MARKET_ALREADY_RESOLVED);
        assert!(timestamp::now_seconds() < market.end_time, ERR_MARKET_ALREADY_RESOLVED);

        let bet_coin = coin::withdraw<CoinType>(bettor, amount);
        coin::merge(&mut state.treasury, bet_coin);

        if (is_yes) {
            market.total_yes_amount = market.total_yes_amount + amount;
        } else {
            market.total_no_amount = market.total_no_amount + amount;
        };

        if (!table::contains(&state.user_bets, bettor_addr)) {
            table::add(&mut state.user_bets, bettor_addr, table::new());
        };

        let user_bets = table::borrow_mut(&mut state.user_bets, bettor_addr);
        if (!table::contains(user_bets, question)) {
            table::add(user_bets, question, UserBet { yes_amount: 0, no_amount: 0 });
        };

        let user_bet = table::borrow_mut(user_bets, question);
        if (is_yes) {
            user_bet.yes_amount = user_bet.yes_amount + amount;
        } else {
            user_bet.no_amount = user_bet.no_amount + amount;
        };
    }

    public entry fun resolve_market<CoinType>(
        resolver: &signer,
        question: String,
        outcome: bool,
    ) acquires PredictionMarketState {
        let resolver_addr = signer::address_of(resolver);
        let state = borrow_global_mut<PredictionMarketState<CoinType>>(@prediction_market);

        assert!(table::contains(&state.markets, question), ERR_MARKET_NOT_FOUND);
        let market = table::borrow_mut(&mut state.markets, question);
        assert!(!market.resolved, ERR_MARKET_ALREADY_RESOLVED);
        assert!(market.creator == resolver_addr, ERR_UNAUTHORIZED);

        market.resolved = true;
        market.outcome = outcome;
    }

    public entry fun claim_winnings<CoinType>(
        claimer: &signer,
        question: String,
    ) acquires PredictionMarketState {
        let claimer_addr = signer::address_of(claimer);
        let state = borrow_global_mut<PredictionMarketState<CoinType>>(@prediction_market);

        assert!(table::contains(&state.markets, question), ERR_MARKET_NOT_FOUND);
        let market = table::borrow(&state.markets, question);
        assert!(market.resolved, ERR_MARKET_NOT_RESOLVED);

        assert!(table::contains(&state.user_bets, claimer_addr), ERR_MARKET_NOT_FOUND);
        let user_bets = table::borrow_mut(&mut state.user_bets, claimer_addr);
        assert!(table::contains(user_bets, question), ERR_MARKET_NOT_FOUND);
        let user_bet = table::borrow_mut(user_bets, question);

        let winning_amount = if (market.outcome) {
            user_bet.yes_amount
        } else {
            user_bet.no_amount
        };

        if (winning_amount > 0) {
            let total_pool = market.total_yes_amount + market.total_no_amount;
            let winning_pool = if (market.outcome) market.total_yes_amount else market.total_no_amount;
            let winnings = (winning_amount as u128) * (total_pool as u128) / (winning_pool as u128);
            let winnings_coin = coin::extract(&mut state.treasury, (winnings as u64));
            coin::deposit(claimer_addr, winnings_coin);
        };

        // Reset user's bet for this market
        user_bet.yes_amount = 0;
        user_bet.no_amount = 0;
    }

    #[view]
    public fun get_market_info<CoinType>(question: String): (address, u64, u64, u64, bool, bool) acquires PredictionMarketState {
        let state = borrow_global<PredictionMarketState<CoinType>>(@prediction_market);
        assert!(table::contains(&state.markets, question), ERR_MARKET_NOT_FOUND);
        let market = table::borrow(&state.markets, question);
        (market.creator, market.end_time, market.total_yes_amount, market.total_no_amount, market.resolved, market.outcome)
    }

    #[view]
    public fun get_user_bet<CoinType>(user: address, question: String): (u64, u64) acquires PredictionMarketState {
        let state = borrow_global<PredictionMarketState<CoinType>>(@prediction_market);
        assert!(table::contains(&state.user_bets, user), ERR_MARKET_NOT_FOUND);
        let user_bets = table::borrow(&state.user_bets, user);
        assert!(table::contains(user_bets, question), ERR_MARKET_NOT_FOUND);
        let user_bet = table::borrow(user_bets, question);
        (user_bet.yes_amount, user_bet.no_amount)
    }
}