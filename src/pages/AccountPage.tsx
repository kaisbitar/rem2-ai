import type React from "react";
import { css } from "styled-system/css";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getSiteUrl } from "@/utils/constants/env";

const AccountPage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<>
			{!user ? (
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "3",
					})}
				>
					<h3 className={css({ fontWeight: 700 })}>Save your footprint</h3>
					<p className={css({ fontSize: "sm", color: "gray.700" })}>
						Create a free account to sync your history and receipts.
					</p>
					<button
						type="button"
						className={css({
							paddingX: "4",
							paddingY: "2",
							borderRadius: "sm",
							backgroundColor: "green.600",
							color: "white",
							width: "fit-content",
						})}
						onClick={() => navigate("/signup")}
					>
						Create free account
					</button>
				</div>
			) : (
				<div
					className={css({
						display: "flex",
						flexDirection: "column",
						gap: "3",
					})}
				>
					<h3 className={css({ fontWeight: 700 })}>Your account</h3>
					<button
						type="button"
						className={css({
							paddingX: "4",
							paddingY: "2",
							borderRadius: "sm",
							backgroundColor: "gray.100",
						})}
						onClick={() =>
							window.open(
								`${getSiteUrl()}/dashboard`,
								"_blank",
								"noopener,noreferrer",
							)
						}
					>
						Manage on web
					</button>
				</div>
			)}
		</>
	);
};

export default AccountPage;
