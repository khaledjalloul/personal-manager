import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import styled from "styled-components";
import { VideoGame, VideoGameType } from "../types";
import {
  Edit,
  Today,
  Save,
  Delete,
  Clear,
  Check,
  CreditCard,
  SellOutlined,
  SportsEsportsOutlined,
  PeopleOutlineOutlined,
  InsertLink
} from "@mui/icons-material";
import { useState } from "react";

export const VideoGameCard = ({ game }: { game: VideoGame }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(game.name);
  const [platform, setPlatform] = useState(game.platform);
  const [type, setType] = useState(game.type);
  const [completed, setCompleted] = useState(game.completed);
  const [firstPlayed, setFirstPlayed] = useState(game.firstPlayed);
  const [price, setPrice] = useState(game.price);
  const [extraPurchases, setExtraPurchases] = useState(game.extraPurchases);
  const [storeUrl, setStoreUrl] = useState(game.storeUrl);
  const [coverImage, setCoverImage] = useState(game.coverImage);

  const sumExtraPurchases = extraPurchases.reduce((acc, purchase) => acc + purchase.price, 0);

  return (
    <Wrapper>
      <CoverImage src={coverImage} />

      <ContentBox sx={{ backgroundColor: "secondary.main", display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography variant="h6" color="text.primary" sx={{ mr: 1 }}>
              {name}
            </Typography>
          ) : (
            <TextField
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {!isEditing && (
            <IconButton sx={{ ml: 'auto' }} onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}

          {isEditing && (
            <IconButton sx={{ ml: 'auto', }}>
              <Save color="success" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton>
              <Delete color="error" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton onClick={() => {
              setName(game.name);
              setPlatform(game.platform);
              setType(game.type);
              setCompleted(game.completed);
              setFirstPlayed(game.firstPlayed);
              setPrice(game.price);
              setExtraPurchases(game.extraPurchases);
              setStoreUrl(game.storeUrl);
              setCoverImage(game.coverImage);
              setIsEditing(false)
            }}>
              <Clear />
            </IconButton>
          )}

          {!isEditing && (
            <IconButton onClick={() => window.open(storeUrl, '_blank')}>
              <InsertLink />
            </IconButton>
          )}
        </Box>

        <Grid container rowSpacing={1} columnSpacing={2}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportsEsportsOutlined />
            {!isEditing ? (
              <Typography variant="body1">
                {platform}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleOutlineOutlined />
            {!isEditing ? (
              <Typography variant="body1">
                {type}
              </Typography>
            ) : (
              <Select
                variant="standard"
                value={type}
                onChange={(e) => setType(e.target.value as VideoGameType)}
              >
                <MenuItem value={VideoGameType.ONLINE}>Online</MenuItem>
                <MenuItem value={VideoGameType.SINGLE_PLAYER}>Single Player</MenuItem>
                <MenuItem value={VideoGameType.BOTH}>Online & Single Player</MenuItem>
              </Select>
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today />
            {!isEditing ? (
              <Typography variant="body1">
                {firstPlayed.toLocaleDateString("en-US")}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={firstPlayed.toLocaleDateString("en-US")}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setFirstPlayed(isNaN(newDate.getTime()) ? firstPlayed : newDate);
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Check />
            {!isEditing ? (
              <Typography variant="body1">
                {completed ? "Completed" : "Not Completed"}
              </Typography>
            ) : (
              <Select
                variant="standard"
                value={completed ? "true" : "false"}
                onChange={(e) => setCompleted(e.target.value === "true")}
              >
                <MenuItem value="true">Completed</MenuItem>
                <MenuItem value="false">Not Completed</MenuItem>
              </Select>
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SellOutlined />
            {!isEditing ? (
              <Typography variant="body1">
                {price} $
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={price.toFixed(2)}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setPrice(isNaN(newPrice) ? price : newPrice);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCard />
            {!isEditing ? (
              <Typography variant="body1">
                {sumExtraPurchases} $
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={price.toFixed(2)}
                onChange={(e) => {
                  const newPrice = parseFloat(e.target.value);
                  setPrice(isNaN(newPrice) ? price : newPrice);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">$</InputAdornment>,
                }}
              />
            )}
          </Grid>

          {isEditing && (
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <TextField
                variant="standard"
                value={storeUrl}
                sx={{ flexGrow: 1 }}
                onChange={(e) => setStoreUrl(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><InsertLink /></InputAdornment>,
                }}
              />
            </Grid>
          )}
        </Grid>
      </ContentBox>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const CoverImage = styled.img`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 100%;
    aspect-ratio: 16/9;
`;

const ContentBox = styled(Box)`
    padding: 24px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;