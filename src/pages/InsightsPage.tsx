import StatsSection from "@/components/popup/StatsSection";
import type React from "react";
import { css } from "styled-system/css";
import { useAuth } from "@/context/AuthContext";
import DonationBanner from "@/components/popup/DonationBanner";
import { useUserState } from "@/context/UserStateContext";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useNavigate } from "react-router-dom";

const InsightsPage: React.FC = () => {
	const { isGuest } = useUserState();
	const navigate = useNavigate();
	const [filter, setFilter] = useState<"today" | "7d" | "30d" | "lifetime">(
		"today",
	);
	const [softwallOpen, setSoftwallOpen] = useState(false);

	// if (authLoading) {
	// 	return <div className={css({ padding: "5" })}>Loading…</div>;
	// }

	const selectRow = css({
		display: "flex",
		gap: "2",
		marginLeft: "311px",
		marginBottom: "-49px",
	});

	const selectCss = css({
		paddingY: "1",
		paddingX: "2",
		borderRadius: "sm",
		border: "1px solid",
		borderColor: "gray.200",
		backgroundColor: "white",
		fontSize: "sm",
		color: "gray.700",
	});

	return (
		<>
			<DonationBanner />

			<div className={selectRow}>
				<select
					id="insights-range"
					className={selectCss}
					value={filter}
					onChange={(e) => {
						const value = e.target.value as "today" | "7d" | "30d" | "lifetime";
						if (value !== "today" && isGuest) {
							setSoftwallOpen(true);
							return;
						}
						setFilter(value);
					}}
				>
					<option value="today">Today</option>
					<option value="7d">7 days</option>
					<option value="30d">30 days</option>
					<option value="lifetime">Lifetime</option>
				</select>
			</div>

			<div className={css({ overflow: "hidden" })}>
				<StatsSection dateFilter={filter} />
			</div>

			<Modal open={softwallOpen} onClose={() => setSoftwallOpen(false)}>
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "3",
					})}
				>
					<h3 className={css({ fontWeight: 700 })}>Save your footprint</h3>
					<p className={css({ fontSize: "sm", color: "gray.700" })}>
						Create a free account to unlock 7-day, 30-day and lifetime history
						across devices.
					</p>
					<div
						className={css({
							display: "flex",
							gap: "2",
							justifyContent: "flex-end",
						})}
					>
						<button
							type="button"
							className={css({
								paddingX: "3",
								paddingY: "2",
								borderRadius: "sm",
								backgroundColor: "gray.100",
							})}
							onClick={() => setSoftwallOpen(false)}
						>
							Not now
						</button>
						<button
							type="button"
							className={css({
								paddingX: "3",
								paddingY: "2",
								borderRadius: "sm",
								backgroundColor: "green.600",
								color: "white",
							})}
							onClick={() => navigate("/signup")}
						>
							Create free account
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default InsightsPage;
