from reconciliation.payout_verification import verify_payout


def test_valid_stripe_payout():
    result = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3875.00,
    )

    assert result["status"] == "valid"
    assert result["expected_net"] == 3875.00
    assert result["difference"] == 0.00


def test_stripe_payout_with_refund():
    result = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=100.00,
        net_amount=3775.00,
    )

    assert result["status"] == "valid"
    assert result["expected_net"] == 3775.00


def test_invalid_stripe_payout():
    result = verify_payout(
        gross_amount=4000.00,
        fees=125.00,
        refunds=0.00,
        net_amount=3850.00,
    )

    assert result["status"] == "mismatch"
    assert result["expected_net"] == 3875.00
    assert result["difference"] == -25.00


def test_acmecloud_stripe_payouts():
    payouts = [
        (4000.00, 125.00, 0.00, 3875.00),
        (2200.00, 75.00, 0.00, 2125.00),
        (1900.00, 50.00, 0.00, 1850.00),
    ]

    for gross, fees, refunds, net in payouts:
        result = verify_payout(
            gross_amount=gross,
            fees=fees,
            refunds=refunds,
            net_amount=net,
        )

        assert result["status"] == "valid"
        assert result["difference"] == 0.00