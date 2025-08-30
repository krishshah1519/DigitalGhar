# %% [markdown]
# # Indian Startup Funding EDA (Analysis with Updated Dataset)
#
# This notebook performs a comprehensive EDA on the Indian startup ecosystem funding data.
#
# **Objectives:**
# 1.  Load the dataset.
# 2.  Clean and preprocess the data, focusing on funding amounts, dates, and categorical features.
# 3.  Visualize key trends in funding over time, by sector, and by city.
# 4.  Identify top investors and understand investment stage distributions.

# %%
# Import essential libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import re

# Set plotting styles
sns.set_style('whitegrid')
plt.style.use('fivethirtyeight')

# %% [markdown]
# ## 1. Data Loading and Initial Inspection
#
# **(CHANGE)** We now load a single CSV file. Make sure `funding_data.csv` is in your `data/raw` folder.

# %%
# Load the single dataset
df = pd.read_csv('../data/raw/funding_data.csv')

print("Shape of the dataset:", df.shape)
df.head()

# %%
df.info()

# %% [markdown]
# ## 2. Data Cleaning (The 80/20 Core Task)
#
# This is the most critical step. We'll standardize column names and clean the key fields.

# %%
# **(CHANGE)** Standardize new column names to a consistent format
df.rename(columns={
    'Date': 'date',
    'Startup Name': 'company',
    'Industry Vertical': 'sector',
    'Sub-Vertical': 'sub_sector',
    'City  Location': 'city',
    'Investors Name': 'investors',
    'InvestmentnType': 'stage',
    'Amount in USD': 'amount_usd',
}, inplace=True)

# Drop the Sr No column as it's just an index
df.drop(columns=['Sr No'], inplace=True)


# %% [markdown]
# ### 2.1. Cleaning the 'Amount' Column
#
# **(CHANGE)** The `amount_usd` column is much cleaner. We just need to remove commas and convert it to a numeric type. Then we'll convert it to INR Crores for our analysis.
#
# **Assumption:** 1 USD = 75 INR

# %%
# Clean the amount_usd column by removing commas and converting to numeric
df['amount_usd_clean'] = pd.to_numeric(df['amount_usd'].astype(str).str.replace(',', ''), errors='coerce')

# Convert USD to INR Crores
# 1 Crore = 10,000,000
df['amount_in_crores'] = (df['amount_usd_clean'] * 75) / 10**7

df[['amount_usd', 'amount_in_crores']].sample(5)

# %% [markdown]
# ### 2.2. Cleaning 'Date' and Creating Time Features

# %%
# The date column has multiple formats, let's standardize it.
# Some dates might be invalid, so we use `errors='coerce'`.
df['date'] = pd.to_datetime(df['date'], errors='coerce')

# Drop rows where date could not be parsed
df.dropna(subset=['date'], inplace=True)

# Create Year, Month, and Quarter
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month_name()
df['quarter'] = df['date'].dt.quarter

df[['date', 'year', 'month']].head()


# %% [markdown]
# ### 2.3. Standardizing Categorical Data (City & Sector)

# %%
# Clean city names
df['city'] = df['city'].str.strip().str.title()
city_map = {
    'Bangalore': 'Bengaluru',
    'New Delhi': 'Delhi-NCR',
    'Delhi': 'Delhi-NCR',
    'Gurgaon': 'Delhi-NCR',
    'Noida': 'Delhi-NCR',
    'Gurugram': 'Delhi-NCR'
}
df['city'] = df['city'].replace(city_map)

# Clean sector names
df['sector'] = df['sector'].str.strip().str.title()
sector_map = {
    'Edtech': 'Ed-Tech',
    'Edutech': 'Ed-Tech',
    'E-Commerce': 'E-commerce',
    'Ecommerce': 'E-commerce',
    'Fintech': 'Fin-Tech',
    'Financial Technology': 'Fin-Tech'
}
df['sector'] = df['sector'].replace(sector_map)


# %% [markdown]
# ### 2.4. Handling Missing Values and Final Touches

# %%
# Drop rows that are fundamentally unusable for our analysis
df.dropna(subset=['company', 'sector', 'amount_in_crores'], inplace=True)

# Split multiple investors into a list
df['investors'] = df['investors'].fillna('Unknown').str.split(', ')

# Create a final clean DataFrame
final_df = df[[
    'date', 'year', 'month', 'quarter', 'company', 'sector',
    'city', 'stage', 'amount_in_crores', 'investors'
]].copy()

print("Shape of the cleaned dataset:", final_df.shape)
final_df.isnull().sum()

# %% [markdown]
# ## 3. Exploratory Data Analysis (Visualizations)
#
# The visualization code from here on remains the same as it operates on our standardized `final_df`.

# %% [markdown]
# ### 3.1. Total Funding Over The Years

# %%
yearly_funding = final_df.groupby('year')['amount_in_crores'].sum().reset_index()

fig = px.line(
    yearly_funding,
    x='year',
    y='amount_in_crores',
    title='Total Startup Funding in India per Year (in INR Crores)',
    labels={'year': 'Year', 'amount_in_crores': 'Total Funding (INR Crores)'},
    markers=True
)
fig.update_layout(yaxis_tickprefix='₹')
fig.show()

# %% [markdown]
# ### 3.2. Top Sectors by Funding

# %%
top_n = 10
sector_funding = final_df.groupby('sector')['amount_in_crores'].sum().sort_values(ascending=False)
top_sectors = sector_funding.head(top_n).reset_index()

fig = px.bar(
    top_sectors,
    x='sector',
    y='amount_in_crores',
    title=f'Top {top_n} Sectors by Funding',
    labels={'sector': 'Sector', 'amount_in_crores': 'Total Funding (INR Crores)'},
    color='sector'
)
fig.update_layout(xaxis_title="", showlegend=False)
fig.show()


# %% [markdown]
# ### 3.3. Funding Distribution by City and Year (Heatmap)

# %%
top_cities = final_df['city'].value_counts().nlargest(10).index
city_year_funding = final_df[final_df['city'].isin(top_cities)].pivot_table(
    index='city',
    columns='year',
    values='amount_in_crores',
    aggfunc='sum'
).fillna(0)

plt.figure(figsize=(12, 8))
sns.heatmap(
    city_year_funding,
    annot=True,
    fmt=".0f",
    cmap="viridis",
    linewidths=.5,
    cbar_kws={'label': 'Funding (INR Crores)'}
)
plt.title('City vs. Year Funding Heatmap (Top 10 Cities)')
plt.xlabel('Year')
plt.ylabel('City')
plt.show()

# %% [markdown]
# ### 3.4. Top Investors (by Deal Count)

# %%
investors_df = final_df.explode('investors')
investors_df['investors'] = investors_df['investors'].str.strip()
# Filter out "undisclosed" and blank investors
investors_df = investors_df[~investors_df['investors'].str.lower().isin(['undisclosed investors', 'unknown', ''])]

top_investors_by_count = investors_df['investors'].value_counts().nlargest(10)

fig = px.bar(
    top_investors_by_count,
    orientation='h',
    title='Top 10 Investors by Number of Deals',
    labels={'value': 'Number of Deals', 'index': 'Investor'}
)
fig.update_layout(yaxis={'categoryorder':'total ascending'})
fig.show()

# %% [markdown]
# ## 4. Save Cleaned Data

# %%
output_path = '../data/processed/funding_clean.csv'
final_df.to_csv(output_path, index=False)
print(f"Cleaned data saved to {output_path}")